import { AppConfigDO } from '@/domain/model/AppConfigDO';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';

@Provider()
export class AppConfigRepository extends PPRepository<AppConfigDO> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(AppConfigDO);
  }

  async create(data: DeepPartialData<AppConfigDO>, manager?: EntityManager): Promise<AppConfigDO> {
    const id = await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...data,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<AppConfigDO>, opts?: FindManyOpt): Promise<[AppConfigDO[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts?.pagination?.offset,
        take: opts?.pagination.size,
      }),
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.key && {
          key: Like(`${condition.key}%`),
        })
      },
      order: {
        key: 'ASC',
        createAt: 'DESC',
        ...opts?.order,
      },
      select: opts?.select as (keyof AppConfigDO)[]
    });
  }
}
