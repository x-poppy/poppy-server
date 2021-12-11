import { Inject, Provider } from '@augejs/core';
import { PPService } from './PPService';
import { AppLangRepository } from '@/infrastructure/repository/AppLangRepository';
import { AppLangEntity } from '../model/AppLangEntity';

@Provider()
export class AppLangService extends PPService<AppLangEntity, AppLangRepository> {

  @Inject(AppLangRepository)
  protected repository!: AppLangRepository;
}
