import { Inject, Provider } from '@augejs/core';
import { AppConfigRepository } from '@/infrastructure/repository/AppConfigRepository';
import { AppConfigDO } from '../model/AppConfigDO';
import { PPService } from './PPService';

@Provider()
export class AppConfigService extends PPService<AppConfigDO, AppConfigRepository> {

  @Inject(AppConfigRepository)
  protected repository!: AppConfigRepository;
}
