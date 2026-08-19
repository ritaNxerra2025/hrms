import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DepartmentsService } from '../organization/departments/departments.service';
import { RolesService } from '../roles/roles.service';
import { UserPermissionsService } from './user-permissions.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findByIdForTenant: jest.fn(),
    findAllForTenant: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    replaceRoles: jest.fn(),
  };
  const rolesService = { findAll: jest.fn() };
  const departmentsService = { findOne: jest.fn() };
  const userPermissionsService = { getPermissionNames: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: RolesService, useValue: rolesService },
        { provide: DepartmentsService, useValue: departmentsService },
        { provide: UserPermissionsService, useValue: userPermissionsService },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  describe('create', () => {
    it('creates a user with a hashed password and normalized email', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      rolesService.findAll.mockResolvedValue([]);
      usersRepository.create.mockResolvedValue({ id: 10, tenantId: 1 });
      usersRepository.findByIdForTenant.mockResolvedValue({
        id: 10,
        tenantId: 1,
        email: 'a@b.com',
      });

      const result = await service.create(1, {
        firstName: 'A',
        lastName: 'B',
        email: ' A@B.com ',
        password: 'Strong@Pass123',
      });

      const created = usersRepository.create.mock.calls[0][0];
      expect(created.passwordHash).toMatch(/^\$2[aby]\$/);
      expect(created.email).toBe('a@b.com');
      expect(created.tenantId).toBe(1);
      expect(result.id).toBe(10);
    });

    it('throws ConflictException for a duplicate email', async () => {
      usersRepository.findByEmail.mockResolvedValue({ id: 1 });

      await expect(
        service.create(1, {
          firstName: 'A',
          lastName: 'B',
          email: 'a@b.com',
          password: 'Strong@Pass123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('throws BadRequestException when a role belongs to another tenant', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      rolesService.findAll.mockResolvedValue([{ id: 5 }]);

      await expect(
        service.create(1, {
          firstName: 'A',
          lastName: 'B',
          email: 'a@b.com',
          password: 'Strong@Pass123',
          roleIds: [5, 99],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('assigns roles after creating the user', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      rolesService.findAll.mockResolvedValue([{ id: 5 }, { id: 6 }]);
      usersRepository.create.mockResolvedValue({ id: 10, tenantId: 1 });
      usersRepository.findByIdForTenant.mockResolvedValue({
        id: 10,
        tenantId: 1,
      });

      await service.create(1, {
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        password: 'Strong@Pass123',
        roleIds: [5, 6],
      });

      expect(usersRepository.replaceRoles).toHaveBeenCalledWith(10, [5, 6]);
    });
  });

  describe('findOne', () => {
    it('returns the user within the tenant', async () => {
      usersRepository.findByIdForTenant.mockResolvedValue({
        id: 2,
        tenantId: 1,
      });

      const result = await service.findOne(1, 2);

      expect(usersRepository.findByIdForTenant).toHaveBeenCalledWith(1, 2);
      expect(result.id).toBe(2);
    });

    it('throws NotFoundException for a user in another tenant', async () => {
      usersRepository.findByIdForTenant.mockResolvedValue(null);
      await expect(service.findOne(2, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignRoles', () => {
    it('replaces the roles for the user', async () => {
      usersRepository.findByIdForTenant.mockResolvedValue({
        id: 2,
        tenantId: 1,
      });
      rolesService.findAll.mockResolvedValue([{ id: 5 }]);

      const result = await service.assignRoles(1, 2, { roleIds: [5] });

      expect(usersRepository.replaceRoles).toHaveBeenCalledWith(2, [5]);
      expect(result.id).toBe(2);
    });

    it('throws BadRequestException when a role belongs to another tenant', async () => {
      usersRepository.findByIdForTenant.mockResolvedValue({
        id: 2,
        tenantId: 1,
      });
      rolesService.findAll.mockResolvedValue([{ id: 5 }]);

      await expect(
        service.assignRoles(1, 2, { roleIds: [99] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('deletes a user within the tenant', async () => {
      usersRepository.findByIdForTenant.mockResolvedValue({
        id: 2,
        tenantId: 1,
      });
      usersRepository.remove.mockResolvedValue(1);

      await expect(service.remove(1, 2)).resolves.toBeUndefined();
      expect(usersRepository.remove).toHaveBeenCalledWith(2);
    });

    it('throws NotFoundException for a user in another tenant', async () => {
      usersRepository.findByIdForTenant.mockResolvedValue(null);
      await expect(service.remove(2, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
