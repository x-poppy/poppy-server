import { Inject, Provider } from '@augejs/core';

import { ResourceRepository } from '@/infrastructure/repository/ResourceRepository';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { RolePermissionRepository } from '@/infrastructure/repository/RolePermissionRepository';
import { RoleEntity } from '../model/RoleEntity';
import { PermissionBo, PermissionsBo } from '../bo/PermissionsBo';

@Provider()
export class RolePermissionService {
  @Inject(RoleRepository)
  private roleRepository!: RoleRepository;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(RolePermissionRepository)
  private rolePermissionRepository!: RolePermissionRepository;

  private cachedMergedRolePermissions: Map<string, PermissionsBo> = new Map();

  private async findSelfPermissions(role: RoleEntity, parentPermissions: PermissionsBo): Promise<PermissionsBo> {
    const roleResourcePermEntities = await this.rolePermissionRepository.findAllByRoleNo(role.roleNo);
    const permissions = new PermissionsBo();

    if (roleResourcePermEntities) {
      for (const roleResourcePermEntity of roleResourcePermEntities) {
        const permissionName = roleResourcePermEntity.resourceCode;
        if (parentPermissions.has(permissionName)) {
          const permission = new PermissionBo(roleResourcePermEntity.resourceCode);
          permissions.set(permission);
        }
      }
    }

    return permissions;
  }

  private async findParentPermissions(role: RoleEntity): Promise<PermissionsBo> {
    if (!role.parent || !role.inherited) {
      return new PermissionsBo();
    }

    return await this.findMergedPermissionsByRoleNo(role.parent);
  }

  private async findAppPermissions(role: RoleEntity): Promise<PermissionsBo> {
    if (!role.hasAppResPerms) {
      return new PermissionsBo();
    }

    const resources = await this.resourceRepository.findAllByAppNoAndStatusNormal(role.appNo);
    const permissions = new PermissionsBo();
    if (resources) {
      for (const resource of resources) {
        const permissionName = resource.resourceCode;
        const permission = new PermissionBo(permissionName);
        permissions.set(permission);
      }
    }
    return permissions;
  }

  private async findMergedPermissionsByRoleNo(roleNo: string): Promise<PermissionsBo> {
    if (this.cachedMergedRolePermissions.has(roleNo)) {
      return this.cachedMergedRolePermissions.get(roleNo) as PermissionsBo;
    }

    const role = await this.roleRepository.findByStatusNormal(roleNo);
    if (!role) {
      return new PermissionsBo();
    }

    const roleAppPermissions = await this.findAppPermissions(role);
    const roleParentPermissions = await this.findParentPermissions(role);
    const roleSelfPermissions = await this.findSelfPermissions(role, roleParentPermissions);

    const mergedPermissions = new PermissionsBo().merge(roleAppPermissions).merge(roleParentPermissions).merge(roleSelfPermissions);

    this.cachedMergedRolePermissions.set(roleNo, mergedPermissions);

    return mergedPermissions;
  }

  async findPermissionsByRoleNo(roleNo: string): Promise<PermissionsBo> {
    return this.findMergedPermissionsByRoleNo(roleNo);
  }
}
