import { Inject, Provider } from '@augejs/core';
import { EntityManager, LessThan, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { UserDO } from '../../domain/model/UserDO';
import { PPRepository } from './PPRepository';
import { FindManyOpt } from '@/types/FindManyOpt';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';

@Provider()
export class UserRepository extends PPRepository<UserDO> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(UserDO);
  }

  override async create(condition: DeepPartialData<UserDO>, manager?: EntityManager): Promise<UserDO> {
    const id = condition.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...condition,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<UserDO>, opts?: FindManyOpt): Promise<[UserDO[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.appLevel && {
          appLevel: LessThan(condition.appLevel + 1)
        }),
        ...(condition.accountName && {
          accountName: Like(`${condition.accountName}%`),
        }),
        ...(condition.mobileNo && {
          mobileNo: Like(`${condition.mobileNo}%`)
        }),
        ...(condition.registerIP && {
          registerIP: condition.registerIP,
        }),
        ...(condition.status && {
          status: condition.status
        })
      },
      order: {
        appLevel: 'DESC',
        createAt: 'DESC',
        accountName: 'ASC',
        ...opts?.order,
      },
      select: opts?.select  as (keyof UserDO)[]
    });
  }
}
