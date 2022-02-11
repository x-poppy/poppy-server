import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { AppDO } from '../../domain/model/AppDO';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';
@Provider()
export class AppRepository extends PPRepository<AppDO> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(AppDO);
  }

  override async create(data: DeepPartialData<AppDO>, manager?: EntityManager): Promise<AppDO> {
    const id = data.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...data,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<AppDO>, opts?: FindManyOpt): Promise<[AppDO[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.parent && {
          parent: condition.parent
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
      select: opts?.select as (keyof AppDO)[]
    });
  }
}
