import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { ResourceRepository } from '@/infrastructure/repository/ResourceRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { MenuTreeBo } from '../bo/MenuTreeBo';
import { PermissionsBo } from '../bo/PermissionsBo';
import { ResourceEntity, ResourcePosition } from '../model/ResourceEntity';

@Provider()
export class MenuService {
  @GetLogger()
  logger!: ILogger;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async findMenuTreesByAppNo(appNo: string, permissionsBo: PermissionsBo, position?: ResourcePosition.HEAD | ResourcePosition.HOME): Promise<MenuTreeBo[]> {
    const app = (await this.appRepository.findByStatusNormal(appNo)) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let resources = await this.resourceRepository.findAllMenusByStatusNormal(app.level, position);

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

  private filterResourcesByPermission(resources: ResourceEntity[], permissionsBo: PermissionsBo): ResourceEntity[] {
    return resources.filter((resource) => {
      return permissionsBo.has(resource.resourceCode);
    });
  }

  private findChildrenMenus(resources: ResourceEntity[], parent: string): ResourceEntity[] {
    const results: ResourceEntity[] = [];
    resources.forEach((resource) => {
      if (resource.parent === parent) {
        results.push(resource);
      }
    });
    return results;
  }

  private buildMenuTree(menu: MenuTreeBo, resources: ResourceEntity[]): MenuTreeBo {
    const childrenResources = this.findChildrenMenus(resources, menu.node.resourceCode);
    for (const childrenResource of childrenResources) {
      const childMenu = this.buildMenuTree(new MenuTreeBo(childrenResource), resources);
      menu.addChild(childMenu);
    }
    return menu;
  }
}
