import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { RenderFunction, VIEWS_IDENTIFIER } from '@augejs/views';
import { PageService } from '../../domain/service/PageService';

@Prefix('/page')
@Provider()
export class PageController {
  @Inject(VIEWS_IDENTIFIER)
  private render!: RenderFunction;

  @Inject(PageService)
  private pageService!: PageService;

  @RequestMapping.Get('/:pageName')
  async find(@RequestParams.Context() context: KoaContext, @RequestParams.Params('pageName') pageName: string): Promise<string> {
    context.type = 'html';

    const page = await this.pageService.find(pageName);
    const pageSchema = page?.schema;

    // here is 404 page
    if (!pageSchema) {
      return await this.render('page404.ejs');
    }

    return await this.render('page.ejs', { pageSchema: JSON.stringify(pageSchema) });
  }
}
