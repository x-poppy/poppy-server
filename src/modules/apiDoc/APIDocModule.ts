import { IKoaContext, RequestMapping, RequestParams } from '@augejs/koa';
import { Provider } from '@augejs/core';

@Provider()
export class APIDocModule {
  @RequestMapping.Get('/')
  async home(@RequestParams.Context() context: IKoaContext): Promise<void> {
    context.redirect('/public/apidoc/index.html');
  }
}
