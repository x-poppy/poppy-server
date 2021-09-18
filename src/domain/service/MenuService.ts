import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { MenuRepository } from '@/infrastructure/repository/MenuRepository';
import { PageRepository } from '@/infrastructure/repository/PageRepository';
import { PoppyAccessData } from '@/types/PoppyAccessData';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { HttpStatus, KoaContext } from '@augejs/koa';
import { MenuTreeBo } from '../bo/MenuTreeBo';
import { PermissionsBo } from '../bo/PermissionsBo';
import { MenuEntity, MenuPosition } from '../model/MenuEntity';
import { PageEntity } from '../model/PageEntity';

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

  async findMenuTreesByAppNo(appNo: string, permissionsBo: PermissionsBo, position?: MenuPosition.HEAD | MenuPosition.HOME): Promise<MenuTreeBo[]> {
    const app = (await this.appRepository.findByStatusNormal(appNo)) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let resources = await this.menuRepository.findAllMenusByNormalStatus(app.level, position);

    // from top tp bottom
    if (!resources || resources.length === 0) return [];
    resources = this.filterResourcesByPermission(resources, permissionsBo);

    // find the first root resource
    const rootResources = resources.filter((resource) => resource.parent === null);
    if (!rootResources) return [];

    const results: MenuTreeBo[] = [];
    for (const rootResource of rootResources) {
      const menuTreeBo = this.buildMenuTree(new MenuTreeBo(rootResource), resources);
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

  async showPage(ctx: KoaContext, menuCode: string): Promise<PageEntity | undefined> {
    // h  ere if we visit the page from menu we need to check the state and permission
    const menu = await this.menuRepository.findMenuByNormalStatus(menuCode);
    if (!menu) {
      return;
    }

    const accessData = ctx.accessData as PoppyAccessData;
    const userPermissions = accessData.get<Record<string, boolean>>('userPermissions');
    if (!userPermissions[menu.menuCode]) {
      ctx.throw(HttpStatus.StatusCodes.FORBIDDEN);
    }

    if (!menu.pageNo) return;

    const page = await this.pageRepository.findByNormalStatus(menu.pageNo);
    return page;
  }
}
