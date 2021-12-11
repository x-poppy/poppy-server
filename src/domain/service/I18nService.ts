import { I18nRepository } from '@/infrastructure/repository/I18nRepository';
import { Inject, Provider } from '@augejs/core';
import { I18nEntity } from '../model/I18nEntity';
import { PPService } from './PPService';

@Provider()
export class I18nService extends PPService<I18nEntity, I18nRepository> {

  @Inject(I18nRepository)
  protected repository!: I18nRepository;
}
