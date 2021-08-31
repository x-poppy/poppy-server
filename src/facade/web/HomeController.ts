import path from 'path';
import { Provider, __appRootDir } from '@augejs/core';
import { KoaContext, RequestMapping, RequestParams } from '@augejs/koa';

@Provider()
export class HomeController {
  @RequestMapping.Get('/')
  async home(@RequestParams.Context() context: KoaContext): Promise<void> {
    context.type = 'html';
    await context.sendFile('./index.html', {
      root: path.join(__appRootDir, './node_modules/@x-poppy/poppy-web/build'),
      maxAge: 0,
    });
  }

  @RequestMapping.Get('/LICENSE')
  async license(@RequestParams.Context() context: KoaContext): Promise<void> {
    context.type = 'text';
    await context.sendFile('./LICENSE', {
      root: __appRootDir,
    });
  }
}
