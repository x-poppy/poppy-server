import { RoleDO } from '@/domain/model/RoleDO';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { DeepPartial, EntityManager, LessThan, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';

@Provider()
export class RoleRepository extends PPRepository<RoleDO> {


  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(RoleDO);
  }

  override async create(opts: DeepPartial<RoleDO>, manager?: EntityManager): Promise<RoleDO> {
    const id = opts.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...opts,
      id,
    });
  }

  override async findMany(condition: DeepPartial<RoleDO>, opts?: FindManyOpt): Promise<[RoleDO[], number]> {
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
        ...(condition.level && {
          level: LessThan(condition.level + 1),
        }),
        ...(condition.status && {
          status: condition.status,
        }),
        ...(condition.title && {
          title: Like(`${condition.title}%`),
        }),
        ...(condition.appLevel && {
          appLevel: LessThan(condition.appLevel + 1)
        })
      },
      order: {
        appLevel: 'DESC',
        createAt: 'DESC',
        title: 'ASC',
        ...opts?.order,
      },
      select: opts?.select as (keyof RoleDO)[]
    });
  }
}
