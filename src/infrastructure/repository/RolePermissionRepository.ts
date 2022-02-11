import { RolePermissionDO } from '@/domain/model/RolePermissionDO';
import { FindAllOpt } from '@/types/FindAllOpt';
import { FindOneOpt } from '@/types/FindOneOpts';
import { Provider } from '@augejs/core';
import { DeepPartial } from '@augejs/typeorm';
import { PPRepository } from './PPRepository';

@Provider()
export class RolePermissionRepository extends PPRepository<RolePermissionDO> {

  constructor() {
    super(RolePermissionDO);
  }

  override async findOne(condition: DeepPartial<RolePermissionDO>, opts?: FindOneOpt): Promise<RolePermissionDO | undefined> {
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
      select: opts?.select as (keyof RolePermissionDO)[]
    });
  }

  override async findAll(condition: DeepPartial<RolePermissionDO>, opts?: FindAllOpt): Promise<RolePermissionDO[]> {
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
      select: opts?.select as (keyof RolePermissionDO)[]
    })
  }
}
