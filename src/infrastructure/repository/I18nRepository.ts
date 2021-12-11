import { I18nEntity } from '@/domain/model/I18nEntity';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';


@Provider()
export class I18nRepository extends PPRepository<I18nEntity> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(I18nEntity);
  }

  override async create(opts: DeepPartialData<I18nEntity>, manager?: EntityManager): Promise<I18nEntity> {
    const id = opts.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...opts,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<I18nEntity>, opts?: FindManyOpt): Promise<[I18nEntity[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.locale && {
          locale: Like(`${condition.locale}%`),
        }),
        ...(condition.key && {
          key: Like(`${condition.key}%`),
        }),
      },
      order: {
        locale: 'ASC',
        key: 'ASC',
        createAt: 'DESC',
        ...opts?.order,
      },
      select: opts?.select as (keyof I18nEntity)[]
    });
  }
}
