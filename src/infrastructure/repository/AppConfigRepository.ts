import { AppConfigEntity } from '@/domain/model/AppConfigEntity';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, getRepository, Like, Repository } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';

interface CreateOpt {
  appNo: string;
  group: string;
  key: string;
  value: string;
  desc?: string | null;
}

interface ListOpts {
  offset: number;
  size: number;
  key?: string;
  appNo: string;
}

interface UpdateOpts {
  id: string;
  key?: string;
  value?: string;
  desc?: string;
}

interface FindConditionOpts {
  appNo: string;
  key: string;
}

@Provider()
export class AppConfigRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  private repository: Repository<AppConfigEntity> = getRepository(AppConfigEntity);

  async create(opts: CreateOpt, manager?: EntityManager): Promise<AppConfigEntity> {
    const repository = manager?.getRepository(AppConfigEntity) ?? this.repository;
    const uniqueId = await this.uniqueIdService.getUniqueId();
    return repository.create({
      id: uniqueId,
      appNo: opts.appNo,
      value: opts.value,
      desc: opts.desc,
    });
  }

  async findById(id: string): Promise<AppConfigEntity | undefined> {
    return this.repository.findOne(id);
  }

  async list(opts: ListOpts): Promise<[AppConfigEntity[], number]> {
    return this.repository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,
        ...(opts.key && {
          key: Like(`${opts.key}%`),
        }),
      },
      order: {
        createAt: 'DESC',
      },
    });
  }

  async findByCondition(opts: FindConditionOpts): Promise<AppConfigEntity | undefined> {
    return this.repository.findOne(opts);
  }

  async update(opts: UpdateOpts): Promise<void> {
    await this.repository.update(opts.id, opts);
  }

  async delete(id: string, manager?: EntityManager): Promise<void> {
    const repository = manager?.getRepository(AppConfigEntity) ?? this.repository;
    await repository.delete(id);
  }
}
