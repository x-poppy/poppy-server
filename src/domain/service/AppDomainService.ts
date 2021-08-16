import { Inject, Provider } from '@augejs/core';
import { AppDomainEntity } from '../model/AppDomainEntity';
import { AppDomainRepository } from '../../infrastructure/repository/AppDomainRepository';
import { AppDomainUIInfoBo } from '../bo/AppUIDomainInfoBo';

@Provider()
export class AppDomainService {
  @Inject(AppDomainRepository)
  private appDomainRepository!: AppDomainRepository;

  async find(appDomain: string): Promise<AppDomainEntity | undefined> {
    return await this.appDomainRepository.findByStatusNormal(appDomain);
  }
}
