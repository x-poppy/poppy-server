import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { RenderFunction, VIEWS_IDENTIFIER } from '@augejs/views';

@Prefix('/api/page')
@Provider()
export class PageController {
  @Inject(VIEWS_IDENTIFIER)
  render!: RenderFunction;

  @RequestMapping.Get()
  async login(@RequestParams.Context() context: KoaContext): Promise<string> {
    context.type = 'html';
    const pageSchema = JSON.stringify({});
    return await this.render('pageTemplate.ejs', { pageSchema });
  }
}
