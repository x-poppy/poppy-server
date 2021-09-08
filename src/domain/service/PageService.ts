import { Inject, Provider } from '@augejs/core';
import { PageEntity } from '../model/PageEntity';
import { PageRepository } from '../../infrastructure/repository/PageRepository';

interface CreateOpt {
  appNo: string;
  resourceCode: string;
  content: string | null;
  desc: string | null;
}

interface ListOpts {
  appNo: string;
  offset: number;
  size: number;
}

@Provider()
export class PageService {
  @Inject(PageRepository)
  private pageRepository!: PageRepository;

  async create(opts: CreateOpt): Promise<void> {
    return await this.pageRepository.create(opts);
  }

  async find(pageCode: string): Promise<PageEntity | undefined> {
    return await this.pageRepository.find(pageCode);
  }

  async list(opts: ListOpts): Promise<[PageEntity[], number]> {
    return await this.pageRepository.list(opts);
  }
}
