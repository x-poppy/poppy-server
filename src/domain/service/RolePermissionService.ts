import { Inject, Provider } from '@augejs/core';
import { RolePermissionRepository } from '@/infrastructure/repository/RolePermissionRepository';
import { PermissionsBo } from '../bo/PermissionsBo';
import { RolePermissionEntity } from '../model/RolePermissionEntity';
import { PPService } from './PPService';
import { RoleService } from './RoleService';
import { MenuRepository } from '@/infrastructure/repository/MenuRepository';

@Provider()
export class RolePermissionService extends PPService<RolePermissionEntity, RolePermissionRepository> {

  @Inject(RoleService)
  private roleService!: RoleService;

  @Inject(MenuRepository)
  private menuRepository!: MenuRepository;

  @Inject(RolePermissionRepository)
  protected override repository!: RolePermissionRepository;

  private async findRoleSelfPermissions(roleId: string): Promise<PermissionsBo> {
    const rolePermissions = await this.repository.findAll(
      {
        roleId
      }, {
      select: ['appId', 'menuCode']
    });

    return PermissionsBo.fromRolePermissions(rolePermissions);
  }


  private async findAppPermissions(appId: string, appLevel: number): Promise<PermissionsBo> {
    const menus = await this.menuRepository.findAllNoPermissionMenus(appId, appLevel);
    return PermissionsBo.fromMenu(menus);
  }

  private async findParentPermissions(parentRoleId: string): Promise<PermissionsBo> {
    if (parentRoleId === '0') return new PermissionsBo();
    return this.findMergedPermissionsByRoleId(parentRoleId)
  }

  private async findMergedPermissionsByRoleId(roleId: string): Promise<PermissionsBo> {
    const role = await this.roleService.findOne({ id: roleId }, { select: [ 'id', 'parent', 'appId', 'appLevel' ] });
    if (!role) {
      return new PermissionsBo();
    }

    const appPermissions = await this.findAppPermissions(role.appId, role.appLevel);
    const parentRolePermissions = await this.findParentPermissions(role.parent);
    const roleSelfPermissions = await this.findRoleSelfPermissions(role.id);

    const mergedPermissions = new PermissionsBo()
      .merge(roleSelfPermissions)
      .filter(parentRolePermissions)
      .merge(appPermissions);

    return mergedPermissions;
  }

  async findPermissionsBoByRoleId(roleId: string): Promise<PermissionsBo> {
    return this.findMergedPermissionsByRoleId(roleId);
  }
}
