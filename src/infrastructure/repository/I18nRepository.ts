import { I18nEntity } from '@/domain/model/18nEntity';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, getRepository, Like, Repository } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';

interface CreateOpts {
  appNo: string;
  locale: string;
  key: string;
  value: string;
  desc?: string;
}

interface ListOpts {
  appNo: string;
  locale?: string;
  key?: string;
  offset: number;
  size: number;
}

interface AllOpts {
  appNo: string;
  locale: string;
}

interface UpdateOpts {
  id: string;
  appNo: string;
  locale?: string;
  key?: string;
  value?: string;
  desc?: string;
}

interface DeleteOpts {
  id: string;
  appNo: string;
}

@Provider()
export class I18nRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  private repository: Repository<I18nEntity> = getRepository(I18nEntity);

  async create(opts: CreateOpts, manager?: EntityManager): Promise<I18nEntity> {
    const repository = manager?.getRepository(I18nEntity) ?? this.repository;
    const uniqueId = await this.uniqueIdService.getUniqueId();

    return repository.create({
      id: uniqueId,
      appNo: opts.appNo,
      locale: opts.locale,
      key: opts.key,
      value: opts.value,
      desc: opts.desc ?? null,
    });
  }

  async update(opts: UpdateOpts): Promise<void> {
    await this.repository.update(
      {
        id: opts.id,
        appNo: opts.appNo,
      },
      opts,
    );
  }

  async list(opts: ListOpts): Promise<[I18nEntity[], number]> {
    return this.repository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,

        ...(opts.locale && {
          locale: opts.locale,
        }),
        ...(opts.key && {
          package: Like(`${opts.key}%`),
        }),
      },
      order: {
        key: 'ASC',
        createAt: 'DESC',
      },
    });
  }

  async all(opts: AllOpts): Promise<I18nEntity[]> {
    return this.repository.find({
      where: {
        appNo: opts.appNo,
        locale: opts.locale,
      },
    });
  }

  async delete(opts: DeleteOpts, manager?: EntityManager): Promise<void> {
    const repository = manager?.getRepository(I18nEntity) ?? this.repository;
    await repository.delete(opts);
  }
}
