import { Inject, Provider } from '@augejs/core';
import { PageContentType, PageEntity } from '../model/PageEntity';
import { PageRepository } from '../../infrastructure/repository/PageRepository';
import { MenuRepository } from '@/infrastructure/repository/MenuRepository';
import { HttpStatus, KoaContext } from '@augejs/koa';
import { PoppyAccessData } from '@/types/PoppyAccessData';

interface CreateOpt {
  appNo: string;
  title: string;
  content: string | null;
  contentType: PageContentType;
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

  async list(opts: ListOpts): Promise<[PageEntity[], number]> {
    return await this.pageRepository.list(opts);
  }
}
