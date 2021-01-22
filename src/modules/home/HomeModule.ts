import { IKoaContext, RequestMapping, RequestParams } from "@augejs/koa";
import { Provider } from "@augejs/module-core";

@Provider()
export class HomeModule {

  @RequestMapping.Get('/ping')
  async ping() {
    return 'pong';
  }

  @RequestMapping.Get('/')
  async home(@RequestParams.Context() context: IKoaContext) {
    context.redirect('/public/apidoc/index.html');
  }
}
