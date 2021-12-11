import { AppServerProxyService } from '@/domain/service/ServerProxyService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerTag } from '@augejs/koa-swagger';

@SwaggerTag({ name: 'WebHook', description: '`WebHook` Entity.'})
@Prefix('/api/v1/webhook')
@Provider()
export class WebHookController {

  // @KoaAccessTokenMiddleware()
  // @RequestMapping.All('/:serverName/:serverPath?')
  // async proxy(
  //   @RequestParams.Context() context: KoaContext,
  //   @RequestParams.Params('serverName') serverName: string,
  //   @RequestParams.Params('serverPath') serverPath: string,
  // ): Promise<unknown> {
  // }
}
