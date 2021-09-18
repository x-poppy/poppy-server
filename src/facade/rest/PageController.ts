import { PageEntity } from '@/domain/model/PageEntity';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { RenderFunction, VIEWS_IDENTIFIER } from '@augejs/views';
import { PageService } from '../../domain/service/PageService';
import { CreatePageDto } from '../dto/CreatePageDto';

@Prefix('/api/v1/page/page')
@Provider()
export class PageController {
  @Inject(VIEWS_IDENTIFIER)
  private render!: RenderFunction;

  @Inject(PageService)
  private pageService!: PageService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('/')
  async create(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body() @RequestValidator(CreatePageDto) createPageDto: CreatePageDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo');

    await this.pageService.create({
      appNo,
      ...createPageDto,
    });

    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('offset') @RequestParams((value: string) => ~~value) offset: number,
    @RequestParams.Query('size') @RequestParams((value: string) => ~~value) size: number,
  ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo') ?? null;

    const [list, count] = await this.pageService.list({
      offset,
      size,
      appNo,
    });

    return {
      list,
      count,
    };
  }
}
