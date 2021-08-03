import { ResourceEntity, ResourceStatus, ResourceType } from '@/domain/model/ResourceEntity';
import { Provider } from '@augejs/core';
import { getRepository, LessThan, Repository } from '@augejs/typeorm';
@Provider()
export class ResourceRepository {
  private resourceRepository: Repository<ResourceEntity> = getRepository(ResourceEntity);

  async findAllByAppNoAndStatusNormal(appNo: string): Promise<ResourceEntity[] | undefined> {
    return await this.resourceRepository.find({
      where: {
        appNo,
        status: ResourceStatus.NORMAL,
      },
    });
  }

  async findAllMenuByStatusNormal(appLevel: number): Promise<ResourceEntity[] | undefined> {
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


}
