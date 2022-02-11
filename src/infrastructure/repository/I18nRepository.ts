import { I18nDO } from '@/domain/model/I18nDO';
import { DeepPartialData } from '@/types/DeepPartialData';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, Like } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';


@Provider()
export class I18nRepository extends PPRepository<I18nDO> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(I18nDO);
  }

  override async create(opts: DeepPartialData<I18nDO>, manager?: EntityManager): Promise<I18nDO> {
    const id = opts.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...opts,
      id,
    });
  }

  override async findMany(condition: FindDeepPartial<I18nDO>, opts?: FindManyOpt): Promise<[I18nDO[], number]> {
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
      select: opts?.select as (keyof I18nDO)[]
    });
  }

  async findMessageBundle(appId: string, appLevel: number, locale: string, keys: string[]): Promise<Record<string, string>>  {
    if (keys.length === 0) return {};

    const repository = this.getRepository();
    const results = await repository
      .createQueryBuilder('i18n')
      .select(['i18n.key, i18n.value'])
      .distinctOn(['i18n.key'])
      .where('i18n.locale = :locale and (i18n.appId = :appId or i18n.appLevel < :appLevel) and i18n.key in (:...keys)', { appId, locale, appLevel, keys })
      .limit(keys.length)
      .orderBy('appLevel', 'DESC')
      .getRawMany<{key: string, value: string}>()
    return results.reduce<Record<string, string>>((map, item) => {
      map[item.key] = item.value;
      return map;
    }, {});
  }
}
