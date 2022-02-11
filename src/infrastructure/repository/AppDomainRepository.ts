import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { AppDomainDO } from '../../domain/model/AppDomainDO';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';
@Provider()
export class AppDomainRepository extends PPRepository<AppDomainDO> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(AppDomainDO);
  }

  override async create(opts: DeepPartialData<AppDomainDO>, manager?: EntityManager): Promise<AppDomainDO> {
    const id = await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...opts,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<AppDomainDO>, opts?: FindManyOpt): Promise<[AppDomainDO[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.domain && {
          domain: Like(`${condition.domain}%`),
        }),
        ...(condition.status && {
          status: condition.status
        })
      },
      order: {
        createAt: 'DESC',
        domain: 'ASC',
        ...opts?.order,
      },
      select: opts?.select as (keyof AppDomainDO)[]
    });
  }
}
