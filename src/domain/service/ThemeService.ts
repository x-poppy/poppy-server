import { ThemeRepository } from '@/infrastructure/repository/ThemeRepository';
import { Inject, Provider } from '@augejs/core';
import { ThemeEntity } from '../model/ThemeEntity';
import { PPService } from './PPService';

@Provider()
export class ThemeService extends PPService <ThemeEntity,ThemeRepository>{

  @Inject(ThemeRepository)
  protected repository!: ThemeRepository;
}
