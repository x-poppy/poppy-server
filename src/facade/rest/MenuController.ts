import { Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/menu')
@Provider()
export class MenuController {
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(@RequestParams.Context() context: KoaContext): Promise<Record<string, unknown>> {
    const parent = (context.accessData?.get('orgNo') as string) ?? null;
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    // const [list, count] = await this.orgService.list({
    //   offset,
    //   size,
    //   appNo,
    //   parent,
    // });
    // return {
    //   list,
    //   count,
    // };

    return {};
  }
}
