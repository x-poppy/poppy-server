import { ResourceEntity, ResourceStatus, ResourceType } from '@/domain/model/ResourceEntity';
import { Provider } from '@augejs/core';
import { getRepository, LessThan, Repository } from '@augejs/typeorm';
@Provider()
export class ResourceRepository {
  private resourceRepository: Repository<ResourceEntity> = getRepository(ResourceEntity);

  async findAllPermissionsByAppNo(appNo: string): Promise<ResourceEntity[] | undefined> {
    return await this.resourceRepository.find({
      where: {
        appNo,
        hasPermission: true,
        status: ResourceStatus.NORMAL,
      },
    });
  }

  async findAllGlobalPermissionsByAppLevel(appLevel: number): Promise<ResourceEntity[] | undefined> {
    return await this.resourceRepository.find({
      where: {
        appLevel: LessThan(appLevel + 1),
        hasPermission: false,
        status: ResourceStatus.NORMAL,
      },
    });
  }

  async findAllMenusByStatusNormal(appLevel: number): Promise<ResourceEntity[] | undefined> {
    return await this.resourceRepository.find({
      where: {
        appLevel: LessThan(appLevel + 1),
        type: ResourceType.MENU,
        status: ResourceStatus.NORMAL,
      },
      order: {
        priority: 'DESC',
      },
    });
  }

  async findAllHeadIconsByStatusNormal(appLevel: number): Promise<ResourceEntity[] | undefined> {
    return await this.resourceRepository.find({
      where: {
        appLevel: LessThan(appLevel + 1),
        type: ResourceType.HEAD_ICON,
        status: ResourceStatus.NORMAL,
      },
      order: {
        priority: 'DESC',
      },
    });
  }

  async findMenuByResourceCode(resourceCode: string): Promise<ResourceEntity | undefined> {
    return await this.resourceRepository.findOne(resourceCode, {
      where: {
        type: ResourceType.MENU,
      },
    });
  }
}
