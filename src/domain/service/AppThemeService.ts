import { AppThemeRepository } from '@/infrastructure/repository/AppThemeRepository';
import { Inject, Provider } from '@augejs/core';

@Provider()
export class AppThemeService {
  @Inject(AppThemeRepository)
  appThemeRepository!: AppThemeRepository;
}
