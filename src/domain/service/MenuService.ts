import { MenuListDTO } from '@/facade/dto/MenuDTO';
import { MenuRepository } from '@/infrastructure/repository/MenuRepository';
import { PPAccessData } from '@/types/PPAccessData';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { MenuTreeBO } from '../bo/MenuTreeBO';
import { MenuDO, MenuPermissionType, MenuStatus, MenuType } from '../model/MenuDO';
import { PPService } from './PPService';
import { RolePermissionService } from './RolePermissionService';

@Provider()
export class MenuService extends PPService <MenuDO,MenuRepository> {

  @GetLogger()
  logger!: ILogger;

  @Inject(MenuRepository)
  protected override repository!: MenuRepository;

  // @Inject(RoleRepository)
  // private roleRepository!: RoleRepository;

  @Inject(RolePermissionService)
  private rolePermissionService!: RolePermissionService;

  async menuTreeBySideBar(accessData: PPAccessData): Promise<MenuTreeBO> {
    const appId = accessData.get<string>('appId');
    const appLevel = accessData.get<number>('appLevel');
    const userRoleId = accessData.get<string>('userRoleId');
    const menus = await this.repository.findAllBySideBar(appId, appLevel);
    const permissionsBo = await this.rolePermissionService.findPermissionsBoByRoleId(userRoleId);
    const permissableMenus = permissionsBo.filterMenus(menus);

    return MenuTreeBO.create(null, permissableMenus);
  }

  async menuTreeByList(accessData: PPAccessData, queryDTO: MenuListDTO): Promise<MenuTreeBO> {
    const appId = accessData.get<string>('appId');
    const appLevel = accessData.get<number>('appLevel');
    const userRoleId = accessData.get<string>('userRoleId');
    const menus = await this.repository.findAll({
      appId,
      appLevel: appLevel,
      ...(queryDTO.status && {
        status: queryDTO.status,
      }),
      ...(queryDTO.menuCode && {
        menuCode: queryDTO.menuCode
      })

    });
    const permissionsBo = await this.rolePermissionService.findPermissionsBoByRoleId(userRoleId);
    const permissableMenus = permissionsBo.filterMenus(menus);

    return MenuTreeBO.create(null, permissableMenus);
  }

}
