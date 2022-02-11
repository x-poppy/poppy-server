import { CustomizedServiceDO } from '@/domain/model/CustomizedServiceDO';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';
@Provider()
export class CustomizedServiceRepository extends PPRepository<CustomizedServiceDO> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(CustomizedServiceDO);
  }

  override async create(data: DeepPartialData<CustomizedServiceDO>, manager?: EntityManager): Promise<CustomizedServiceDO> {
    const id = data.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...data,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<CustomizedServiceDO>, opts?: FindManyOpt): Promise<[CustomizedServiceDO[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.serviceCode && {
          serviceCode: condition.serviceCode
        }),
        ...(condition.moduleCode && {
          serviceCode: condition.moduleCode
        }),
        ...(condition.title && {
          title: Like(`${condition.title}%`)
        }),
        ...(condition.status && {
          status: condition.status
        })
      },
      order: {
        createAt: 'DESC',
        title: 'ASC',
        ...opts?.order,
      },
      select: opts?.select as (keyof CustomizedServiceDO)[]
    });
  }
}
