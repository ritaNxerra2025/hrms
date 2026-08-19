import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import type { StringValue } from 'ms';
import { Department } from '../../database/models/department.model';
import { Permission } from '../../database/models/permission.model';
import { Role } from '../../database/models/role.model';
import { RolePermission } from '../../database/models/role-permission.model';
import { Tenant } from '../../database/models/tenant.model';
import { User } from '../../database/models/user.model';
import { UserRole } from '../../database/models/user-role.model';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalAuthGuard } from './strategies/local-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.accessExpiresIn') ??
            '15m') as StringValue,
        },
      }),
    }),
    SequelizeModule.forFeature([
      Tenant,
      User,
      Role,
      Department,
      Permission,
      RolePermission,
      UserRole,
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
