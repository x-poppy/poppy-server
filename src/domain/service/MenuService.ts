import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { ResourceRepository } from '@/infrastructure/repository/ResourceRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { MenuItem } from '../bo/MenuItem';
import { ResourceEntity } from '../model/ResourceEntity';

@Provider()
export class MenuService {
  @GetLogger()
  logger!: ILogger;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async findMenuTreeByAppNo(appNo: string, permissions: Record<string, boolean>): Promise<null | MenuItem> {
    const app = (await this.appRepository.findByStatusNormal(appNo)) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let resources = await this.resourceRepository.findAllMenuByStatusNormal(app.level);

    // from top tp bottom
    if (!resources || resources.length === 0) return null;

    resources = this.filterResourceByPermission(resources, permissions);

    // find the first root resource
    const rootResource = resources.find((resource) => resource.parent === null);
    if (!rootResource) return null;

    return this.buildMenuTree(new MenuItem(rootResource), resources);
  }

  private filterResourceByPermission(resources: ResourceEntity[], permissions: Record<string, boolean>): ResourceEntity[] {
    return resources.filter((resource) => {
      return permissions[resource.resourceCode];
    });
  }

  private findChildrenResources(resources: ResourceEntity[], parent: string): ResourceEntity[] {
    const results: ResourceEntity[] = [];
    resources.forEach((resource) => {
      if (resource.parent === parent) {
        results.push(resource);
      }
    });
    return results;
  }

  private buildMenuTree(menu: MenuItem, resources: ResourceEntity[]): MenuItem {
    const childrenResources = this.findChildrenResources(resources, menu.resource.resourceCode);
    for (const childrenResource of childrenResources) {
      const childMenu = this.buildMenuTree(new MenuItem(childrenResource), resources);
      menu.children.push(childMenu);
    }
    return menu;
  }
}
