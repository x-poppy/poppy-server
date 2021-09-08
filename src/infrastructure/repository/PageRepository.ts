import { Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';
import { PageEntity, PageStatus } from '../../domain/model/PageEntity';

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
export class PageRepository {
  pageRepository: Repository<PageEntity> = getRepository(PageEntity);

  async create(opts: CreateOpt): Promise<void> {
    await this.pageRepository.insert(opts);
  }

  async find(pageCode: string): Promise<PageEntity | undefined> {
    const page = await this.pageRepository.findOne(pageCode, {
      where: {
        status: PageStatus.NORMAL,
      },
      select: ['pageCode', 'appNo', 'content', 'type', 'createAt', 'updateAt'],
    });
    return page;
  }

  async list(opts: ListOpts): Promise<[PageEntity[], number]> {
    return this.pageRepository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }
}
