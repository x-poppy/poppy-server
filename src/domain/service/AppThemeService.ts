import { AppThemeRepository } from '@/infrastructure/repository/AppThemeRepository';
import { Inject, Provider } from '@augejs/core';
import { AppThemeEntity } from '../model/AppThemeEntity';

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
}

@Provider()
export class AppThemeService {
  @Inject(AppThemeRepository)
  private appThemeRepository!: AppThemeRepository;

  async list(opts: ListOpts): Promise<[AppThemeEntity[], number]> {
    return this.appThemeRepository.list({
      offset: opts.offset,
      size: opts.size,
      appNo: opts.appNo,
    });
  }
}
