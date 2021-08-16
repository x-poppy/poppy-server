import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { ResourceRepository } from '@/infrastructure/repository/ResourceRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { HeadMenuBo } from '../bo/HeadMenuBo';
import { PermissionsBo } from '../bo/PermissionsBo';
import { ResourceEntity } from '../model/ResourceEntity';

@Provider()
export class HeadMenuService {
  @GetLogger()
  logger!: ILogger;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async list(appNo: string, permissionsBo: PermissionsBo): Promise<HeadMenuBo[] | null> {
    const app = (await this.appRepository.findByStatusNormal(appNo)) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let resources = await this.resourceRepository.findAllHeadMenusByStatusNormal(app.level);
    // from top tp bottom
    if (!resources || resources.length === 0) return null;
    resources = this.filterResourcesByPermission(resources, permissionsBo);

    const headMenus = resources.map((resource) => {
      return new HeadMenuBo(resource);
    });
    return headMenus;
  }

  private filterResourcesByPermission(resources: ResourceEntity[], permissionsBo: PermissionsBo): ResourceEntity[] {
    return resources.filter((resource) => {
      return permissionsBo.has(resource.resourceCode);
    });
  }
}
