import { Inject, Provider } from '@augejs/core';
import { RolePermissionRepository } from '@/infrastructure/repository/RolePermissionRepository';
import { PermissionsBO } from '../bo/PermissionsBO';
import { RolePermissionDO } from '../model/RolePermissionDO';
import { PPService } from './PPService';
import { RoleService } from './RoleService';
import { MenuRepository } from '@/infrastructure/repository/MenuRepository';

@Provider()
export class RolePermissionService extends PPService<RolePermissionDO, RolePermissionRepository> {

  @Inject(RoleService)
  private roleService!: RoleService;

  @Inject(MenuRepository)
  private menuRepository!: MenuRepository;

  @Inject(RolePermissionRepository)
  protected override repository!: RolePermissionRepository;

  private async findRoleSelfPermissions(roleId: string): Promise<PermissionsBO> {
    const rolePermissions = await this.repository.findAll(
      {
        roleId
      }, {
      select: ['appId', 'menuCode']
    });

    return PermissionsBO.fromRolePermissions(rolePermissions);
  }


  private async findAppPermissions(appId: string, appLevel: number): Promise<PermissionsBO> {
    const menus = await this.menuRepository.findAllNoPermissionMenus(appId, appLevel);
    return PermissionsBO.fromMenu(menus);
  }

  private async findParentPermissions(parentRoleId: string): Promise<PermissionsBO> {
    if (parentRoleId === '0') return new PermissionsBO();
    return this.findMergedPermissionsByRoleId(parentRoleId)
  }

  private async findMergedPermissionsByRoleId(roleId: string): Promise<PermissionsBO> {
    const role = await this.roleService.findOne({ id: roleId }, { select: [ 'id', 'parent', 'appId', 'appLevel' ] });
    if (!role) {
      return new PermissionsBO();
    }

    const appPermissions = await this.findAppPermissions(role.appId, role.appLevel);
    const parentRolePermissions = await this.findParentPermissions(role.parent);
    const roleSelfPermissions = await this.findRoleSelfPermissions(role.id);

    const mergedPermissions = new PermissionsBO()
      .merge(roleSelfPermissions)
      .filter(parentRolePermissions)
      .merge(appPermissions);

    return mergedPermissions;
  }

  async findPermissionsBoByRoleId(roleId: string): Promise<PermissionsBO> {
    return this.findMergedPermissionsByRoleId(roleId);
  }
}
