import { ThemeEntity } from '@/domain/model/ThemeEntity';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindAllOpt } from '@/types/FindAllOpt';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';

@Provider()
export class ThemeRepository extends PPRepository <ThemeEntity>{

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(ThemeEntity);
  }

  override async create(data: DeepPartialData<ThemeEntity>, manager?: EntityManager): Promise<ThemeEntity> {
    const id = data.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).create({
      ...data,
      id,
    });
  }

  override async findOne(condition: FindDeepPartial<ThemeEntity>): Promise<ThemeEntity | undefined> {
    return this.getRepository().findOne({
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.key && {
          key: condition.key
        }),
      },
    });
  }

  override async findMany(condition: FindDeepPartial<ThemeEntity>, opts?: FindManyOpt): Promise<[ThemeEntity[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.key && {
          key: Like(`${condition.key}%`),
        }),
      },
      order: {
        createAt: 'DESC',
        key: 'ASC',
        ...opts?.order,
      },
    });
  }

  override async findAll(condition: FindDeepPartial<ThemeEntity>, opts?: FindAllOpt): Promise<ThemeEntity[]> {
    return this.getRepository().find({
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.key && {
          key: Like(`${condition.key}%`),
        }),
      },
      order: {
        createAt: 'DESC',
        key: 'ASC',
        ...opts?.order
      },
    });
  }
}
