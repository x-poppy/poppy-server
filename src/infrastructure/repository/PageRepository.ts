import { Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';
import { PageEntity, PageStatus } from '../../domain/model/PageEntity';

@Provider()
export class PageRepository {
  pageRepository: Repository<PageEntity> = getRepository(PageEntity);

  async create(pageName: string, schema: Record<string, unknown>, status: PageStatus): Promise<PageEntity> {
    const page = new PageEntity();
    page.pageName = pageName;
    page.schema = schema;
    page.status = status;
    await this.pageRepository.save(page);
    return page;
  }

  async find(pageName: string): Promise<PageEntity | undefined> {
    const page = await this.pageRepository.findOne(pageName, {
      where: {
        status: PageStatus.NORMAL,
      },
    });
    return page;
  }

  async list(pageName: string): Promise<PageEntity | undefined> {
    const page = await this.pageRepository.findOne(pageName, {
      where: {
        status: PageStatus.NORMAL,
      },
    });
    return page;
  }
}
