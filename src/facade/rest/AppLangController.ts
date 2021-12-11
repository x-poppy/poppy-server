import { AppLangService } from '@/domain/service/AppLangService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { AppLangEntity } from '@/domain/model/AppLangEntity';

@SwaggerTag({ name: 'AppLang', description: '`AppCountry` entity '})
@Prefix('/api/v1/app-lang')
@Provider()
export class AppLangController {

  @Inject(AppLangService)
  service!: AppLangService;

  @SwaggerAPI('/api/v1/app-lang/list/{appId}', 'get', {
    tags: [ 'AppLang' ],
    summary: 'list',
    parameters: [
      {
        in: 'path',
        name: 'appId',
        type: 'string',
        required: true,
      },
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/AppLangEntity' },
        description: ''
      }
    },
  })
  @RequestMapping.Get('/list/{:appId}')
  async create(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Params('appId') appId: string,
    ): Promise<AppLangEntity[]> {
    return await this.service.findAll({
      appId,
    })
  }
}
