import { AppServerProxyService } from '@/domain/service/ServerProxyService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/extension/server-proxy')
@Provider()
export class ServerProxyController {
  @Inject(AppServerProxyService)
  appServerProxyService!: AppServerProxyService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.All('/:serverName/:serverPath?')
  async proxy(
    @RequestParams.Context() context: KoaContext,
    @RequestParams.Params('serverName') serverName: string,
    @RequestParams.Params('serverPath') serverPath: string,
  ): Promise<unknown> {
    return this.appServerProxyService.proxy(context, serverName, serverPath);
  }
}
