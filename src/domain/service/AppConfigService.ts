import { Inject, Provider } from '@augejs/core';
import { AppConfigRepository } from '@/infrastructure/repository/AppConfigRepository';
import { AppConfigEntity } from '../model/AppConfigEntity';
import { PPService } from './PPService';

@Provider()
export class AppConfigService extends PPService<AppConfigEntity, AppConfigRepository> {

  @Inject(AppConfigRepository)
  protected repository!: AppConfigRepository;
}
