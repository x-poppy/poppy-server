import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { AppThemeRepository } from '@/infrastructure/repository/AppThemeRepository';
import { Inject, Provider } from '@augejs/core';
import { AppDomainUIInfoBo } from '../bo/AppUIDomainInfoBo';
import { AppUIInfoBo } from '../bo/AppUIInfoBo';

@Provider()
export class AppUIService {
  @Inject(AppDomainRepository)
  private appDomainRepository!: AppDomainRepository;

  @Inject(AppThemeRepository)
  appThemeRepository!: AppThemeRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async domainInfo(domain: string): Promise<AppDomainUIInfoBo> {
    const appDomain = await this.appDomainRepository.findByStatusNormal(domain);
    return AppDomainUIInfoBo.createFromAppDomain(appDomain);
  }

  async appInfo(appNo: string): Promise<AppUIInfoBo | null> {
    const app = await this.appRepository.find(appNo);
    if (!app) return null;

    const appUIInfoBo = AppUIInfoBo.createFromApp(app);
    return appUIInfoBo;
  }

  async themeInfo(appNo: string): Promise<Record<string, string | null>> {
    const themeProperties: Record<string, string | null> = {};
    const appThemes = await this.appThemeRepository.listAllByNormalStatus(appNo);
    for (const appTheme of appThemes) {
      themeProperties[appTheme.key] = appTheme.value;
    }
    return themeProperties;
  }
}
