import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { ResourceRepository } from '@/infrastructure/repository/ResourceRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { HeadIconBo } from '../bo/HeadIconBo';
import { PermissionsBo } from '../bo/PermissionsBo';
import { ResourceEntity } from '../model/ResourceEntity';

@Provider()
export class HeadIconService {
  @GetLogger()
  logger!: ILogger;

  @Inject(ResourceRepository)
  private resourceRepository!: ResourceRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async list(appNo: string, permissionsBo: PermissionsBo): Promise<HeadIconBo[] | null> {
    const app = (await this.appRepository.findByStatusNormal(appNo)) ?? null;
    if (!app) {
      this.logger.warn(`the appNo: ${appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let resources = await this.resourceRepository.findAllHeadIconsByStatusNormal(app.level);
    // from top tp bottom
    if (!resources || resources.length === 0) return null;
    resources = this.filterResourcesByPermission(resources, permissionsBo);

    const headIcons = resources.map((resource) => {
      return new HeadIconBo(resource);
    });
    return headIcons;
  }

  private filterResourcesByPermission(resources: ResourceEntity[], permissionsBo: PermissionsBo): ResourceEntity[] {
    return resources.filter((resource) => {
      return permissionsBo.hasPermission(resource.resourceCode);
    });
  }
}
