import { Inject, Provider } from '@augejs/core';
import { AppEntity } from '../model/AppEntity';
import { AppRepository } from '../../infrastructure/repository/AppRepository';

@Provider()
export class AppConfigService {
  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async get(key: string): Promise<string | undefined> {
    return undefined;
  }
}
