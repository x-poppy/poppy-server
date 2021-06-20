import { Inject, Provider } from '@augejs/core';
import { PageEntity, PageStatus } from '../model/PageEntity';
import { PageRepository } from '../../infrastructure/repository/PageRepository';

@Provider()
export class PageService {
  @Inject(PageRepository)
  private pageRepository!: PageRepository;

  async create(pageName: string, schema: Record<string, unknown>, status: PageStatus): Promise<PageEntity> {
    return await this.pageRepository.create(pageName, schema, status);
  }

  async find(pageName: string): Promise<PageEntity | undefined> {
    return await this.pageRepository.find(pageName);
  }
}
