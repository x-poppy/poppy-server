import { ThemeEntity } from '@/domain/model/ThemeEntity';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, getRepository, Like, Repository } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';

interface CreateOpts {
  appNo: string;
  key: string;
  value: string;
  desc?: string;
}

interface ListOpts {
  appNo: string;
  key?: string;
  offset: number;
  size: number;
}

interface AllOpts {
  appNo: string;
}

interface UpdateOpts {
  id: string;
  appNo: string;
  key?: string;
  value?: string;
  desc?: string;
}

interface DeleteOpts {
  id: string;
  appNo: string;
}

@Provider()
export class ThemeRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  private repository: Repository<ThemeEntity> = getRepository(ThemeEntity);

  async create(opts: CreateOpts, manager?: EntityManager): Promise<ThemeEntity> {
    const repository = manager?.getRepository(ThemeEntity) ?? this.repository;
    const uniqueId = await this.uniqueIdService.getUniqueId();

    return repository.create({
      id: uniqueId,
      appNo: opts.appNo,
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

  async list(opts: ListOpts): Promise<[ThemeEntity[], number]> {
    return this.repository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,
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

  async all(opts: AllOpts): Promise<ThemeEntity[]> {
    return this.repository.find({
      where: {
        appNo: opts.appNo,
      },
    });
  }

  async delete(opts: DeleteOpts, manager?: EntityManager): Promise<void> {
    const repository = manager?.getRepository(ThemeEntity) ?? this.repository;
    await repository.delete(opts);
  }
}
