import { AppLangService } from '@/domain/service/AppLangService';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping } from '@augejs/koa';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { AppLangDO } from '@/domain/model/AppLangDO';
import { RequestAppId } from '@/util/decorator/RequestAppId';

@SwaggerTag({ name: 'AppLang', description: '`AppCountry` entity '})
@Prefix('/api/v1/app-lang')
@Provider()
export class AppLangController {

  @Inject(AppLangService)
  service!: AppLangService;

  @SwaggerAPI('/api/v1/app-lang/list', 'get', {
    tags: [ 'AppLang' ],
    summary: 'list',
    parameters: [
      {
        in: 'header',
        name: 'app-id',
        required: true,
        type: 'string'
      }
    ],
    responses: {
      '200': {
        schema: {
          type: 'array',
          items: { $ref: `#/definitions/${AppLangDO.name}` },
        },
        description: ''
      }
    },
  })
  @RequestMapping.Get('list')
  async create(
    @RequestAppId() appId: string,
    ): Promise<AppLangDO[]> {
    return await this.service.findAll({
      appId,
    })
  }
}
