import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { AppDomainEntity } from '../../domain/model/AppDomainEntity';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';
@Provider()
export class AppDomainRepository extends PPRepository<AppDomainEntity> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(AppDomainEntity);
  }

  override async create(opts: DeepPartialData<AppDomainEntity>, manager?: EntityManager): Promise<AppDomainEntity> {
    const id = await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...opts,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<AppDomainEntity>, opts?: FindManyOpt): Promise<[AppDomainEntity[], number]> {
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
      select: opts?.select as (keyof AppDomainEntity)[]
    });
  }
}
