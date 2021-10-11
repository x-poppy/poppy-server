import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { MenuRepository } from '@/infrastructure/repository/MenuRepository';
import { PageRepository } from '@/infrastructure/repository/PageRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { MenuTreeBo } from '../bo/MenuTreeBo';
import { PermissionsBo } from '../bo/PermissionsBo';
import { MenuEntity } from '../model/MenuEntity';

@Provider()
export class MenuService {
  @GetLogger()
  logger!: ILogger;

  @Inject(PageRepository)
  private pageRepository!: PageRepository;

  @Inject(MenuRepository)
  private menuRepository!: MenuRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async findMenuTreesByAppNo(appNo: string, permissionsBo: PermissionsBo): Promise<MenuTreeBo[]> {
    const app = (await this.appRepository.findByStatusNormal(appNo)) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let menus = await this.menuRepository.findAllMenusByNormalStatus(app.level);

    // from top tp bottom
    if (!menus || menus.length === 0) return [];
    menus = this.filterResourcesByPermission(menus, permissionsBo);

    // find the first root resource
    const rootMenus = menus.filter((resource) => resource.parent === null);
    if (!rootMenus) return [];

    const results: MenuTreeBo[] = [];
    for (const rootMenu of rootMenus) {
      const menuTreeBo = this.buildMenuTree(new MenuTreeBo(rootMenu), menus);
      results.push(menuTreeBo);
    }

    return results;
  }

  private filterResourcesByPermission(resources: MenuEntity[], permissionsBo: PermissionsBo): MenuEntity[] {
    return resources.filter((resource) => {
      return permissionsBo.has(resource.menuCode);
    });
  }

  private findChildrenMenus(resources: MenuEntity[], parent: string): MenuEntity[] {
    const results: MenuEntity[] = [];
    resources.forEach((resource) => {
      if (resource.parent === parent) {
        results.push(resource);
      }
    });
    return results;
  }

  private buildMenuTree(menu: MenuTreeBo, resources: MenuEntity[]): MenuTreeBo {
    const childrenResources = this.findChildrenMenus(resources, menu.node.menuCode);
    for (const childrenResource of childrenResources) {
      const childMenu = this.buildMenuTree(new MenuTreeBo(childrenResource), resources);
      menu.addChild(childMenu);
    }
    return menu;
  }
}
