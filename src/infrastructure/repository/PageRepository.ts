import { Inject, Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';
import { PageEntity, PageStatus, PageContentType } from '../../domain/model/PageEntity';
import { UniqueIdService } from '../service/UniqueIdService';

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
export class PageRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  pageRepository: Repository<PageEntity> = getRepository(PageEntity);

  async create(opts: CreateOpt): Promise<void> {
    const pageNo = await this.uniqueIdService.getUniqueId();

    const page = new PageEntity();
    page.pageNo = pageNo;
    page.appNo = opts.appNo;
    page.title = opts.title;
    page.content = opts.content;
    page.contentType = opts.contentType;
    page.desc = opts.desc;

    await this.pageRepository.save(page);
  }

  async find(pageCode: string): Promise<PageEntity | undefined> {
    const page = await this.pageRepository.findOne(pageCode, {
      select: ['pageNo', 'appNo', 'content', 'contentType', 'createAt', 'updateAt'],
    });
    return page;
  }

  async findByNormalStatus(pageNo: string): Promise<PageEntity | undefined> {
    const page = await this.pageRepository.findOne(pageNo, {
      where: {
        status: PageStatus.NORMAL,
      },
      select: ['pageNo', 'title', 'appNo', 'content', 'contentType', 'createAt', 'updateAt'],
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
