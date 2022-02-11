import { ThemeRepository } from '@/infrastructure/repository/ThemeRepository';
import { Inject, Provider } from '@augejs/core';
import { ThemeDO } from '../model/ThemeDO';
import { PPService } from './PPService';

@Provider()
export class ThemeService extends PPService <ThemeDO,ThemeRepository>{

  @Inject(ThemeRepository)
  protected repository!: ThemeRepository;
}
