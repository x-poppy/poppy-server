import { Inject, Provider } from '@augejs/core';
import { EntityManager, LessThan, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { UserEntity } from '../../domain/model/UserEntity';
import { PPRepository } from './PPRepository';
import { FindManyOpt } from '@/types/FindManyOpt';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';

@Provider()
export class UserRepository extends PPRepository<UserEntity> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(UserEntity);
  }

  override async create(condition: DeepPartialData<UserEntity>, manager?: EntityManager): Promise<UserEntity> {
    const id = condition.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...condition,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<UserEntity>, opts?: FindManyOpt): Promise<[UserEntity[], number]> {
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
      select: opts?.select  as (keyof UserEntity)[]
    });
  }
}
