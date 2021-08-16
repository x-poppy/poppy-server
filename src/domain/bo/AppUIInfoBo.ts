import { AppEntity } from '../model/AppEntity';

export class AppUIInfoBo {
  static createFromApp(app: AppEntity): AppUIInfoBo {
    const appUIInfoBo: AppUIInfoBo = new AppUIInfoBo();
    appUIInfoBo.locale = app.locale;
    appUIInfoBo.displayName = app.displayName;
    appUIInfoBo.icp = app.icp;
    appUIInfoBo.icon = app.icon;
    return appUIInfoBo;
  }

  locale = '';
  displayName = '';
  icon: string | null = null;
  icp: string | null = null;
}
