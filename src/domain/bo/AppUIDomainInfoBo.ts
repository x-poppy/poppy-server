import { AppDomainEntity } from '../model/AppDomainEntity';

export class AppDomainUIInfoBo {
  static createFromAppDomain(app?: AppDomainEntity | null): AppDomainUIInfoBo {
    const appUIInfoBo: AppDomainUIInfoBo = new AppDomainUIInfoBo();
    appUIInfoBo.appNo = app?.appNo ?? null;
    return appUIInfoBo;
  }

  appNo: string | null = null;
}
