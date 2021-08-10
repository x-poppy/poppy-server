import { Inject, Provider } from '@augejs/core';

import { ResourceRepository } from '@/infrastructure/repository/ResourceRepository';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { RolePermissionRepository } from '@/infrastructure/repository/RolePermissionRepository';
import { RoleEntity } from '../model/RoleEntity';

@Provider()
export class RolePermissionService {
  @Inject(RoleRepository)
  private roleRepository!: RoleRepository;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(RolePermissionRepository)
  private rolePermissionRepository!: RolePermissionRepository;

  private cachedMergedRolePermissions: Map<string, Record<string, boolean>> = new Map();

  private async findSelfPermissions(role: RoleEntity, parentPermissions: Record<string, boolean>): Promise<Record<string, boolean>> {
    const roleResourcePermEntities = await this.rolePermissionRepository.findAllByRoleNo(role.roleNo);
    const permissions: Record<string, boolean> = {};
    if (roleResourcePermEntities) {
      for (const roleResourcePermEntity of roleResourcePermEntities) {
        permissions[roleResourcePermEntity.resourceCode] = true;
      }
    }

    const filteredPermissions: Record<string, boolean> = {};
    Object.keys(permissions).forEach((permission) => {
      if (parentPermissions[permission]) {
        filteredPermissions[permission] = true;
      }
    });

    return filteredPermissions;
  }

  private async findParentPermissions(role: RoleEntity): Promise<Record<string, boolean>> {
    if (!role.parent) return {};
    if (!role.inherited) return {};

    return await this.findMergedPermissionsByRoleNo(role.parent);
  }

  private async findAppPermissions(role: RoleEntity): Promise<Record<string, boolean>> {
    if (!role.hasAppResPerms) return {};

    const resources = await this.resourceRepository.findAllByAppNoAndStatusNormal(role.appNo);
    const permissions: Record<string, boolean> = {};
    if (resources) {
      for (const resource of resources) {
        permissions[resource.resourceCode] = true;
      }
    }
    return permissions;
  }

  private async findMergedPermissionsByRoleNo(roleNo: string): Promise<Record<string, boolean>> {
    if (this.cachedMergedRolePermissions.has(roleNo)) {
      return this.cachedMergedRolePermissions.get(roleNo) as Record<string, boolean>;
    }

    const role = await this.roleRepository.findByStatusNormal(roleNo);
    if (!role) {
      return {};
    }

    const roleAppPermissions = await this.findAppPermissions(role);
    const roleParentPermissions = await this.findParentPermissions(role);
    const roleSelfPermissions = await this.findSelfPermissions(role, roleParentPermissions);

    const mergedPermissions: Record<string, boolean> = {
      ...roleParentPermissions,
      ...roleAppPermissions,
      ...roleSelfPermissions,
    };

    this.cachedMergedRolePermissions.set(roleNo, mergedPermissions);

    return mergedPermissions;
  }

  async findPermissionsByRoleNo(roleNo: string): Promise<Record<string, boolean>> {
    return this.findMergedPermissionsByRoleNo(roleNo);
  }
}
