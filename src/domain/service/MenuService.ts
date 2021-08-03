import { AppRepository } from "@/infrastructure/repository/AppRepository";
import { ResourceRepository } from "@/infrastructure/repository/ResourceRepository";
import { BusinessError } from "@/util/BusinessError";
import { I18nMessageKeys } from "@/util/I18nMessageKeys";
import { GetLogger, ILogger, Inject, Provider } from "@augejs/core";
import { ResourceEntity } from "../model/ResourceEntity";

interface MenuItem {
  node: ResourceEntity,
  children: MenuItem[]
}

@Provider()
export class MenuService {

  @GetLogger()
  logger!: ILogger;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async findMenuTreeByAppNo(appNo: string): Promise<null | MenuItem> {
    const app = await this.appRepository.findByStatusNormal(appNo) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const resources = await this.resourceRepository.findAllMenuByStatusNormal(app.level);

    // from top tp bottom
    if (!resources || resources.length === 0) return null;

    const rootResource = resources.find((resource => resource.parent === null));
    if (!rootResource) return null;

    return this.buildMenuItem({
      node: rootResource,
      children: []
    }, resources);
  }

  private buildMenuItem(menu: MenuItem, resources: ResourceEntity[]): MenuItem {
    resources.forEach(resource => {
      if (menu.node.appNo === resource.appNo) {
        const childMenu: MenuItem = {
          node: resource,
          children: [],
        }
        this.buildMenuItem(childMenu, resources);
        menu.children.push(childMenu);
      }
    })
    return menu;
  }
}
