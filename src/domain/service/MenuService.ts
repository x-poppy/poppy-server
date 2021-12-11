import { MenuRepository } from '@/infrastructure/repository/MenuRepository';
import { PPAccessData } from '@/types/PPAccessData';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { MenuTreeBo } from '../bo/MenuTreeBo';
import { MenuEntity, MenuPermissionType, MenuStatus, MenuType } from '../model/MenuEntity';
import { PPService } from './PPService';
import { RolePermissionService } from './RolePermissionService';

@Provider()
export class MenuService extends PPService <MenuEntity,MenuRepository> {

  @GetLogger()
  logger!: ILogger;

  @Inject(MenuRepository)
  protected override repository!: MenuRepository;

  // @Inject(RoleRepository)
  // private roleRepository!: RoleRepository;

  @Inject(RolePermissionService)
  private rolePermissionService!: RolePermissionService;

  // async listAll(opts: MenuFindLisOpts): Promise<[MenuTreeBo[], number]> {
  //   const role = await this.roleRepository.findOne({
  //     roleNo: opts.roleNo,
  //     status: RoleStatus.NORMAL
  //   })

  //   if (!role) {
  //     this.logger.warn(`the RoleNo: ${role} is not exist!`);
  //     throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
  //   }

  //   const menus = await this.repository.listAll(opts);
  //   const permissions = await this.rolePermissionService.findPermissionsByRoleNo(opts.roleNo);
  //   const permissableMenus = permissions.filterMenus(menus);

  //   const list = MenuTreeBo.create(null, permissableMenus).children ?? [];
  //   return [list , list.length];
  // }

  async menuTreeBySideBar(accessData: PPAccessData): Promise<MenuTreeBo> {
    const appId = accessData.get<string>('appId');
    const appLevel = accessData.get<number>('appLevel');
    const userRoleId = accessData.get<string>('userRoleId');
    const menus = await this.repository.findAllBySideBar(appId, appLevel);
    const permissionsBo = await this.rolePermissionService.findPermissionsBoByRoleId(userRoleId);
    const permissableMenus = permissionsBo.filterMenus(menus);

    return MenuTreeBo.create(null, permissableMenus);
  }

  async menuTreeByList(accessData: PPAccessData): Promise<MenuTreeBo> {
    const appId = accessData.get<string>('appId');
    const appLevel = accessData.get<number>('appLevel');
    const userRoleId = accessData.get<string>('userRoleId');
    const menus = await this.repository.findAll({
      appId,
      appLevel: appLevel,
      status: MenuStatus.NORMAL,
    });
    const permissionsBo = await this.rolePermissionService.findPermissionsBoByRoleId(userRoleId);
    const permissableMenus = permissionsBo.filterMenus(menus);

    return MenuTreeBo.create(null, permissableMenus);
  }

}
