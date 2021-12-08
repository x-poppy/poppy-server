import { ThemeRepository } from '@/infrastructure/repository/ThemeRepository';
import { Inject, Provider } from '@augejs/core';
import { EntityManager } from '@augejs/typeorm';
import { ThemeEntity } from '../model/ThemeEntity';

interface CreateOpts {
  appNo: string;
  key: string;
  value: string;
  desc?: string;
}

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
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
export class ThemeService {
  @Inject(ThemeRepository)
  private repository!: ThemeRepository;

  async create(opts: CreateOpts, manager?: EntityManager): Promise<ThemeEntity> {
    return this.repository.create(opts, manager);
  }

  async update(opts: UpdateOpts): Promise<void> {
    await this.repository.update(opts);
  }

  async list(opts: ListOpts): Promise<[ThemeEntity[], number]> {
    return this.repository.list({
      offset: opts.offset,
      size: opts.size,
      appNo: opts.appNo,
    });
  }

  async all(opts: AllOpts): Promise<ThemeEntity[]> {
    return this.repository.all(opts);
  }

  async delete(opts: DeleteOpts, manager?: EntityManager): Promise<void> {
    await this.repository.delete(opts, manager);
  }
}
