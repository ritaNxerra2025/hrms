import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;

  const rolesRepository = {
    findByNameForTenant: jest.fn(),
    findByCodeForTenant: jest.fn(),
    create: jest.fn(),
    findByIdForTenant: jest.fn(),
    findAllForTenant: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    replacePermissions: jest.fn(),
  };
  const permissionsService = { ensureExist: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RolesRepository, useValue: rolesRepository },
        { provide: PermissionsService, useValue: permissionsService },
      ],
    }).compile();

    service = moduleRef.get(RolesService);
  });

  describe('create', () => {
    it('creates a role and assigns permissions', async () => {
      rolesRepository.findByNameForTenant.mockResolvedValue(null);
      rolesRepository.findByCodeForTenant.mockResolvedValue(null);
      permissionsService.ensureExist.mockResolvedValue([{ id: 1 }]);
      rolesRepository.create.mockResolvedValue({ id: 3, tenantId: 1 });
      rolesRepository.findByIdForTenant.mockResolvedValue({
        id: 3,
        tenantId: 1,
      });

      const result = await service.create(1, {
        name: 'HR Admin',
        code: 'HR_ADMIN',
        permissionIds: [1],
      });

      expect(rolesRepository.create).toHaveBeenCalledWith({
        tenantId: 1,
        name: 'HR Admin',
        code: 'HR_ADMIN',
        isSystem: false,
      });
      expect(rolesRepository.replacePermissions).toHaveBeenCalledWith(3, [1]);
      expect(result.id).toBe(3);
    });

    it('throws ConflictException for a duplicate name', async () => {
      rolesRepository.findByNameForTenant.mockResolvedValue({ id: 9 });

      await expect(
        service.create(1, { name: 'HR Admin', code: 'HR_ADMIN' }),
      ).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException for a duplicate code', async () => {
      rolesRepository.findByNameForTenant.mockResolvedValue(null);
      rolesRepository.findByCodeForTenant.mockResolvedValue({ id: 9 });

      await expect(
        service.create(1, { name: 'HR Admin', code: 'HR_ADMIN' }),
      ).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when a permission is unknown', async () => {
      rolesRepository.findByNameForTenant.mockResolvedValue(null);
      rolesRepository.findByCodeForTenant.mockResolvedValue(null);
      permissionsService.ensureExist.mockRejectedValue(
        new NotFoundException('Some permissions were not found'),
      );

      await expect(
        service.create(1, {
          name: 'HR Admin',
          code: 'HR_ADMIN',
          permissionIds: [999],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns roles for the tenant', async () => {
      rolesRepository.findAllForTenant.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll(1);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('update', () => {
    it('updates a role', async () => {
      rolesRepository.findByIdForTenant.mockResolvedValue({
        id: 3,
        tenantId: 1,
      });
      rolesRepository.findByNameForTenant.mockResolvedValue(null);
      rolesRepository.findByCodeForTenant.mockResolvedValue(null);
      rolesRepository.update.mockResolvedValue([1]);

      const result = await service.update(1, 3, {
        name: 'HR Director',
      });

      expect(rolesRepository.update).toHaveBeenCalledWith(
        3,
        expect.objectContaining({ name: 'HR Director' }),
      );
      expect(rolesRepository.replacePermissions).not.toHaveBeenCalled();
      expect(result.id).toBe(3);
    });

    it('assigns permissions to a role', async () => {
      rolesRepository.findByIdForTenant.mockResolvedValue({
        id: 3,
        tenantId: 1,
      });
      permissionsService.ensureExist.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const result = await service.assignPermissions(1, 3, {
        permissionIds: [1, 2],
      });

      expect(permissionsService.ensureExist).toHaveBeenCalledWith([1, 2]);
      expect(rolesRepository.replacePermissions).toHaveBeenCalledWith(
        3,
        [1, 2],
      );
      expect(result.id).toBe(3);
    });

    it('throws NotFoundException for a role in another tenant', async () => {
      rolesRepository.findByIdForTenant.mockResolvedValue(null);
      await expect(service.update(2, 3, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deletes a non-system role', async () => {
      rolesRepository.findByIdForTenant.mockResolvedValue({
        id: 3,
        tenantId: 1,
        isSystem: false,
      });
      rolesRepository.remove.mockResolvedValue(1);

      await expect(service.remove(1, 3)).resolves.toBeUndefined();
      expect(rolesRepository.remove).toHaveBeenCalledWith(3);
    });

    it('forbids deleting a system role', async () => {
      rolesRepository.findByIdForTenant.mockResolvedValue({
        id: 2,
        tenantId: 1,
        isSystem: true,
      });

      await expect(service.remove(1, 2)).rejects.toThrow(ForbiddenException);
      expect(rolesRepository.remove).not.toHaveBeenCalled();
    });

    it('throws NotFoundException for a role in another tenant', async () => {
      rolesRepository.findByIdForTenant.mockResolvedValue(null);
      await expect(service.remove(2, 3)).rejects.toThrow(NotFoundException);
    });
  });
});
