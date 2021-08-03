import { Inject, Provider, ScanNode } from '@augejs/core';
import { AppEntity } from '../model/AppEntity';
import { AppRepository } from '../../infrastructure/repository/AppRepository';
import { MiddlewareFactory } from '@augejs/koa';

@Provider()
export class AppConfigService {
  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async get(key: string): Promise<string | undefined> {
    return undefined;
  }
}
