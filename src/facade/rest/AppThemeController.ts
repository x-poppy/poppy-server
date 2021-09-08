import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { AppThemeService } from '@/domain/service/AppThemeService';

@Prefix('/api/v1/app/app-theme')
@Provider()
export class AppThemeController {
  @Inject(AppThemeService)
  private appThemeService!: AppThemeService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('offset') @RequestParams((value: string) => ~~value) offset: number,
    @RequestParams.Query('size') @RequestParams((value: string) => ~~value) size: number,
  ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo');
    const [list, count] = await this.appThemeService.list({
      offset,
      size,
      appNo,
    });
    return {
      list,
      count,
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete(':key')
  async delete(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params('key') key: string): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo');
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(): Promise<Record<string, unknown>> {
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('')
  async update(): Promise<Record<string, unknown>> {
    return {};
  }
}
