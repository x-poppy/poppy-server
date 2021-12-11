import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { CacheService } from '@/infrastructure/service/CacheService';
import { Inject, Provider } from '@augejs/core';
import { AppDomainEntity, AppDomainStatus } from '../model/AppDomainEntity';
import { PPService } from './PPService';

@Provider()
export class AppDomainService extends PPService<AppDomainEntity, AppDomainRepository> {

  @Inject(AppDomainRepository)
  protected repository!: AppDomainRepository;

  async findAppIdByDomain(domain: string): Promise<string | undefined> {
    const appDomain = await this.repository.findOne({
      domain, status: AppDomainStatus.NORMAL
    }, {
      select: ['appId']
    });
    if (!appDomain) return undefined;
    return appDomain.appId;
  }

  async checkDomainAvailable(domain: string): Promise<boolean> {
    const appDomain = await this.repository.findOne({
      domain
    }, {
      select: ['domain']
    });
    return !appDomain;
  }
}
