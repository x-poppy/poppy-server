import { RolePermissionEntity } from '@/domain/model/RolePermissionEntity';
import { FindAllOpt } from '@/types/FindAllOpt';
import { FindOneOpt } from '@/types/FindOneOpts';
import { Provider } from '@augejs/core';
import { DeepPartial } from '@augejs/typeorm';
import { PPRepository } from './PPRepository';

@Provider()
export class RolePermissionRepository extends PPRepository<RolePermissionEntity> {

  constructor() {
    super(RolePermissionEntity);
  }

  override async findOne(condition: DeepPartial<RolePermissionEntity>, opts?: FindOneOpt): Promise<RolePermissionEntity | undefined> {
    return this.getRepository().findOne({
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.roleId && {
          roleId: condition.roleId
        }),
        ...(condition.menuCode && {
          menuCode: condition.menuCode
        }),
      },
      select: opts?.select as (keyof RolePermissionEntity)[]
    });
  }

  override async findAll(condition: DeepPartial<RolePermissionEntity>, opts?: FindAllOpt): Promise<RolePermissionEntity[]> {
    return this.getRepository().find({
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.roleId && {
          roleId: condition.roleId
        }),
        ...(condition.menuCode && {
          menuCode: condition.menuCode
        }),
      },
      order: {
        ...opts?.order
      },
      select: opts?.select as (keyof RolePermissionEntity)[]
    })
  }
}
