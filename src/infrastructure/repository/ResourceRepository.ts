import { ResourceEntity, ResourceStatus } from '@/domain/model/ResourceEntity';
import { Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';
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
}
