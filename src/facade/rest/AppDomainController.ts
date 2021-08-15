import { AppDomainEntity } from '@/domain/model/AppDomainEntity';
import { AppDomainService } from '@/domain/service/AppDomainService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';

@Provider()
@Prefix('/api/v1/app-domain')
export class AppDomainController {
  @Inject(AppDomainService)
  appDomainService!: AppDomainService;

  @RequestMapping.Get('')
  async getAppNoByDomain(@RequestParams.Context() ctx: KoaContext): Promise<Pick<AppDomainEntity, 'appNo' | 'domain'> | null> {
    const targetDomain = ctx.get('x-app-domain') || ctx.request.origin;

    const appDomain = (await this.appDomainService.find(targetDomain)) ?? null;
    if (!appDomain) return null;

    return {
      appNo: appDomain.appNo,
      domain: appDomain.domain,
    };
  }
}
