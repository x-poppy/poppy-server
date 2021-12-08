import { I18nRepository } from '@/infrastructure/repository/I18nRepository';
import { Inject, Provider } from '@augejs/core';
import { EntityManager } from '@augejs/typeorm';
import { I18nEntity } from '../model/18nEntity';

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
export class I18nService {
  @Inject(I18nRepository)
  private repository!: I18nRepository;

  async create(opts: CreateOpts, manager?: EntityManager): Promise<I18nEntity> {
    return this.repository.create(opts, manager);
  }

  async update(opts: UpdateOpts): Promise<void> {
    await this.repository.update(opts);
  }

  async list(opts: ListOpts): Promise<[I18nEntity[], number]> {
    return this.repository.list(opts);
  }

  async all(opts: AllOpts): Promise<I18nEntity[]> {
    return this.repository.all(opts);
  }

  async delete(opts: DeleteOpts, manager?: EntityManager): Promise<void> {
    await this.repository.delete(opts, manager);
  }
}
