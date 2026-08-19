import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import type { StringValue } from 'ms';
import { Sequelize } from 'sequelize-typescript';
import { ROLE_CODE, STATUS, TOKEN_TYPE } from '../../common/constants/system.constants';
import { hashPassword, verifyPassword } from '../../common/utils/password.util';
import { Department } from '../../database/models/department.model';
import { Permission } from '../../database/models/permission.model';
import { Role } from '../../database/models/role.model';
import { RolePermission } from '../../database/models/role-permission.model';
import { Tenant } from '../../database/models/tenant.model';
import { User } from '../../database/models/user.model';
import { UserRole } from '../../database/models/user-role.model';
import { UsersRepository } from '../users/users.repository';
import { UserPermissionsService } from '../users/user-permissions.service';
import { AuthTokensResponse } from './dto/auth-tokens.response';
import { RegisterDto } from './dto/register.dto';
import { AuthProfile, AuthTokens, ValidatedUser } from './types/auth.types';

interface TokenPayload {
  sub: number;
  tenantId: number;
  email?: string;
  type: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userPermissionsService: UserPermissionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Tenant) private readonly tenantModel: typeof Tenant,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectModel(Department) private readonly departmentModel: typeof Department,
    @InjectModel(Permission) private readonly permissionModel: typeof Permission,
    @InjectModel(RolePermission) private readonly rolePermissionModel: typeof RolePermission,
    @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensResponse> {
    const existingUser = await this.usersRepository.findByEmail(
      dto.adminEmail.toLowerCase().trim(),
    );
    if (existingUser) {
      throw new BadRequestException(`Email "${dto.adminEmail}" is already registered`);
    }

    const cleanCode = dto.companyCode.trim().toUpperCase();
    const existingTenant = await this.tenantModel.findOne({
      where: { code: cleanCode },
    });
    if (existingTenant) {
      throw new BadRequestException(`Company code "${cleanCode}" is already in use`);
    }

    return this.sequelize.transaction(async (transaction) => {
      // 1. Create Tenant
      const tenant = await this.tenantModel.create(
        {
          name: dto.companyName.trim(),
          code: cleanCode,
          description:
            dto.companyDescription ?? `Tenant for ${dto.companyName.trim()}`,
          status: STATUS.ACTIVE,
        },
        { transaction },
      );

      // 2. Create Starter Departments
      const [mgmtDept] = await Promise.all([
        this.departmentModel.create(
          {
            tenantId: tenant.id,
            name: 'Management',
            code: 'MGMT',
            // description: 'Executive leadership and company management',
            // status: STATUS.ACTIVE,
          },
          { transaction },
        ),
        this.departmentModel.create(
          {
            tenantId: tenant.id,
            name: 'Information Technology',
            code: 'IT',
            // description: 'Engineering, product, and technical infrastructure',
            // status: STATUS.ACTIVE,
          },
          { transaction },
        ),
        this.departmentModel.create(
          {
            tenantId: tenant.id,
            name: 'Human Resources',
            code: 'HR',
            // description: 'Recruitment, employee relations, and HR management',
            // status: STATUS.ACTIVE,
          },
          { transaction },
        ),
        this.departmentModel.create(
          {
            tenantId: tenant.id,
            name: 'Sales & Marketing',
            code: 'SALES',
            // description: 'Client acquisition, sales, and business expansion',
            // status: STATUS.ACTIVE,
          },
          { transaction },
        ),
      ]);

      // 3. Create Starter Roles
      const [adminRole, hrAdminRole] = await Promise.all([
        this.roleModel.create(
          {
            tenantId: tenant.id,
            name: 'Company Admin',
            code: ROLE_CODE.COMPANY_ADMIN,
            isSystem: true,
          },
          { transaction },
        ),
        this.roleModel.create(
          {
            tenantId: tenant.id,
            name: 'HR Admin',
            code: ROLE_CODE.HR_ADMIN,
            isSystem: false,
          },
          { transaction },
        ),
        this.roleModel.create(
          {
            tenantId: tenant.id,
            name: 'HR Manager',
            code: ROLE_CODE.HR_MANAGER,
            isSystem: false,
          },
          { transaction },
        ),
        this.roleModel.create(
          {
            tenantId: tenant.id,
            name: 'Employee',
            code: ROLE_CODE.EMPLOYEE,
            isSystem: false,
          },
          { transaction },
        ),
      ]);

      // 4. Assign permissions to Company Admin & HR Admin
      const allPermissions = await this.permissionModel.findAll({ transaction });
      if (allPermissions.length > 0) {
        const adminPerms = allPermissions.map((perm) => ({
          roleId: adminRole.id,
          permissionId: perm.id,
        }));
        await this.rolePermissionModel.bulkCreate(adminPerms, { transaction });

        const hrPerms = allPermissions
          .filter((p) =>
            ['user', 'organization', 'employee', 'leave', 'recruitment', 'interview'].includes(
              p.module,
            ),
          )
          .map((perm) => ({
            roleId: hrAdminRole.id,
            permissionId: perm.id,
          }));
        if (hrPerms.length > 0) {
          await this.rolePermissionModel.bulkCreate(hrPerms, { transaction });
        }
      }

      // 5. Create Admin User
      const passwordHash = await hashPassword(dto.adminPassword);
      const user = await this.userModel.create(
        {
          tenantId: tenant.id,
          departmentId: mgmtDept.id,
          fullName: dto.adminFullName.trim(),
          email: dto.adminEmail.toLowerCase().trim(),
          passwordHash,
          phone: dto.adminPhone ?? null,
          status: STATUS.ACTIVE,
        },
        { transaction },
      );

      // 6. Assign Admin Role to User
      await this.userRoleModel.create(
        {
          userId: user.id,
          roleId: adminRole.id,
        },
        { transaction },
      );

      // 7. Issue Auth Tokens
      const tokens = await this.issueTokens(user.id, tenant.id, user.email);
      const permissions = allPermissions.map((p) => p.name);

      return {
        ...tokens,
        user: {
          id: user.id,
          tenantId: tenant.id,
          email: user.email,
          fullName: user.fullName,
          // lastName: user.lastName,
        },
        permissions,
      };
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.usersRepository.findByEmail(email.toLowerCase());

    if (!user || user.status !== STATUS.ACTIVE) {
      return null;
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return null;
    }

    return {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      fullName: user.fullName,
      // lastName: user.lastName,
    };
  }

  async login(user: ValidatedUser): Promise<AuthTokensResponse> {
    await this.usersRepository.update(user.userId, {
      lastLoginAt: new Date(),
    });

    const tokens = await this.issueTokens(
      user.userId,
      user.tenantId,
      user.email,
    );
    const permissions = await this.userPermissionsService.getPermissionNames(
      user.userId,
    );

    return {
      ...tokens,
      user: {
        id: user.userId,
        tenantId: user.tenantId,
        email: user.email,
        fullName: user.fullName,
        // lastName: user.lastName,
      },
      permissions,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== TOKEN_TYPE.REFRESH) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findById(payload.sub);
    if (!user || user.status !== STATUS.ACTIVE) {
      throw new UnauthorizedException(
        'Account is inactive or no longer exists',
      );
    }

    return this.issueTokens(user.id, user.tenantId, user.email);
  }

  async me(userId: number): Promise<AuthProfile> {
    const user = await this.usersRepository.findWithRolesAndPermissions(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    // const permissions =
    //   await this.userPermissionsService.getPermissionNames(userId);
    // return { user, permissions };
    return {user};
  }

  private async issueTokens(
    userId: number,
    tenantId: number,
    email: string,
  ): Promise<AuthTokens> {
    const accessSecret =
      this.configService.getOrThrow<string>('jwt.accessSecret');
    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');
    const accessExpiresIn = (this.configService.get<string>(
      'jwt.accessExpiresIn',
    ) ?? '1d') as StringValue;
    const refreshExpiresIn = (this.configService.get<string>(
      'jwt.refreshExpiresIn',
    ) ?? '7d') as StringValue;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, tenantId, email, type: TOKEN_TYPE.ACCESS },
        { secret: accessSecret, expiresIn: accessExpiresIn },
      ),
      this.jwtService.signAsync(
        { sub: userId, tenantId, type: TOKEN_TYPE.REFRESH },
        { secret: refreshSecret, expiresIn: refreshExpiresIn },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: accessExpiresIn,
    };
  }
}
