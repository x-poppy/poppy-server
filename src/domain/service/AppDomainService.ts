import { Inject, Provider } from '@augejs/core';
import { AppDomainEntity } from '../model/AppDomainEntity';
import { AppDomainRepository } from '../../infrastructure/repository/AppDomainRepository';
import { FindOneOptions } from '@augejs/typeorm';
@Provider()
export class AppDomainService {
  @Inject(AppDomainRepository)
  private appDomainRepository!: AppDomainRepository;
}
