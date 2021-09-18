import { Inject, Provider } from '@augejs/core';

import { MenuRepository } from '@/infrastructure/repository/MenuRepository';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { RolePermissionRepository } from '@/infrastructure/repository/RolePermissionRepository';
import { RoleEntity } from '../model/RoleEntity';
import { PermissionsBo } from '../bo/PermissionsBo';
import { AppRepository } from '@/infrastructure/repository/AppRepository';

@Provider()
export class RolePermissionService {
  @Inject(RoleRepository)
  private roleRepository!: RoleRepository;

  @Inject(MenuRepository)
  private resourceRepository!: MenuRepository;

  @Inject(RolePermissionRepository)
  private rolePermissionRepository!: RolePermissionRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  private cachedMergedRolePermissions: Map<string, PermissionsBo> = new Map();

  private async findSelfPermissions(role: RoleEntity, parentPermissions: PermissionsBo): Promise<PermissionsBo> {
    const rolePermissions = await this.rolePermissionRepository.findAllByRoleNo(role.roleNo);
    return PermissionsBo.fromRolePermissions(rolePermissions, parentPermissions);
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

    const resources = await this.resourceRepository.findAllPermissionsByAppNo(role.appNo);
    return PermissionsBo.fromResources(resources);
  }

  private async findGlobalPermissions(role: RoleEntity): Promise<PermissionsBo> {
    const app = await this.appRepository.findByStatusNormal(role.appNo);
    if (!app) {
      return new PermissionsBo();
    }

    const resources = await this.resourceRepository.findAllPermissionsByAppLevel(app.level);
    return PermissionsBo.fromResources(resources);
  }

  private async findMergedPermissionsByRoleNo(roleNo: string): Promise<PermissionsBo> {
    if (this.cachedMergedRolePermissions.has(roleNo)) {
      return this.cachedMergedRolePermissions.get(roleNo) as PermissionsBo;
    }

    const role = await this.roleRepository.findByStatusNormal(roleNo);
    if (!role) {
      return new PermissionsBo();
    }

    const roleGoalPermissions = await this.findGlobalPermissions(role);
    const roleAppPermissions = await this.findAppPermissions(role);
    const roleParentPermissions = await this.findParentPermissions(role);
    const roleSelfPermissions = await this.findSelfPermissions(role, roleParentPermissions);

    const mergedPermissions = new PermissionsBo().merge(roleGoalPermissions).merge(roleAppPermissions).merge(roleParentPermissions).merge(roleSelfPermissions);

    this.cachedMergedRolePermissions.set(roleNo, mergedPermissions);

    return mergedPermissions;
  }

  async findPermissionsByRoleNo(roleNo: string): Promise<PermissionsBo> {
    return this.findMergedPermissionsByRoleNo(roleNo);
  }
}
