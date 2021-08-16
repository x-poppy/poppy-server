import { AppDomainUIInfoBo } from '@/domain/bo/AppUIDomainInfoBo';
import { AppUIInfoBo } from '@/domain/bo/AppUIInfoBo';
import { AppUIService } from '@/domain/service/AppUIService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';

@Provider()
@Prefix('/api/v1/app-ui')
export class AppUIController {
  @Inject(AppUIService)
  appUIService!: AppUIService;

  @RequestMapping.Get('domain-info/:domain')
  async domainInfo(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params('domain') pathDomain: string): Promise<AppDomainUIInfoBo> {
    pathDomain = pathDomain ?? null;
    if (pathDomain) {
      pathDomain = decodeURIComponent(pathDomain);
    }

    const domain = pathDomain || ctx.request.origin;
    return this.appUIService.domainInfo(domain);
  }

  @RequestMapping.Get('app-info/:appNo')
  async appUIInfo(@RequestParams.Params('appNo') appNo: string): Promise<AppUIInfoBo | null> {
    return this.appUIService.appInfo(appNo);
  }

  @RequestMapping.Get('theme-info/:appNo')
  async domainUIInfo(@RequestParams.Params('appNo') appNo: string): Promise<Record<string, string | null>> {
    return this.appUIService.themeInfo(appNo);
  }
}
