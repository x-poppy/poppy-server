import { Inject, Provider } from '@augejs/core';
import { PPService } from './PPService';
import { AppLangRepository } from '@/infrastructure/repository/AppLangRepository';
import { AppLangDO } from '../model/AppLangDO';

@Provider()
export class AppLangService extends PPService<AppLangDO, AppLangRepository> {

  @Inject(AppLangRepository)
  protected repository!: AppLangRepository;
}
