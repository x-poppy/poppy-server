import { RolePermissionEntity } from '@/domain/model/RolePermissionEntity';
import { Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';

@Provider()
export class RolePermissionRepository {
  private roleResourcePermRepository: Repository<RolePermissionEntity> = getRepository(RolePermissionEntity);

  async findAllByRoleNo(roleNo: string): Promise<RolePermissionEntity[] | undefined> {
    return await this.roleResourcePermRepository.find({
      where: {
        roleNo,
      },
    });
  }
}
