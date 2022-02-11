import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { I18nRepository } from '@/infrastructure/repository/I18nRepository';
import { Inject, Provider } from '@augejs/core';
import { I18nDO } from '../model/I18nDO';
import { PPService } from './PPService';

@Provider()
export class I18nService extends PPService<I18nDO, I18nRepository> {

  @Inject(I18nRepository)
  protected override repository!: I18nRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async findMessageBundle(appId: string, locale: string, requestDTO: Record<string, string>): Promise<Record<string, string>> {
    const app = await this.appRepository.findOne({ id: appId }, { select: ['level'] });
    if (!app) return requestDTO;
    const messageBundles = await this.repository.findMessageBundle(appId, app.level, locale, Object.keys(requestDTO));
    return {
      ...requestDTO,
      ...messageBundles
    };
 }
}
