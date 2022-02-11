import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { ThemeService } from '@/domain/service/ThemeService';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { PPAccessData } from '@/types/PPAccessData';
import { ThemeDO } from '@/domain/model/ThemeDO';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';

@SwaggerTag({ name: 'Theme'})
@Prefix('/api/v1/theme')
@Provider()
export class ThemeController {

  @Inject(ThemeService)
  private service!: ThemeService;

  @SwaggerAPI('/api/v1/theme', 'post', {
    tags: [ 'Theme' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: {
          $ref: '#/definitions/ThemeCreateDto'
        }
      }
    ],
    responses: {
      '200': {
        description: ''
      }
    },
    security: [{
      accessToken: []
    }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body() @RequestValidator(ThemeDO) dto: ThemeDO
    ): Promise<ThemeDO> {
    const accessData = ctx.accessData as PPAccessData;
    const appId = accessData.get<string>('appId');

    return await this.service.create({
      ...dto,
      appId,
    });
  }

  @SwaggerAPI('/api/v1/theme', 'get', {
    tags: [ 'Theme' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'ListI18nDto',
        required: true,
        schema: {
          $ref: '#/definitions/ListThemeDto'
        }
      }
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
            },
            list: {
              type: 'array',
              items: {
                $ref: '#/definitions/ThemeEntity',
              }
            }
          }
        },
        description: ''
      }
    },
    security: [{
      accessToken: []
    }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query() @RequestValidator(ThemeDO) dto: ThemeDO
    ): Promise<{list:ThemeDO[], count: number }> {
    const accessData = ctx.accessData as PPAccessData;
    const appId = accessData.get<string>('appId');

    const [list, count] = await this.service.findMany({
      ...dto,
      appId,
    });

    return {
      list,
      count,
    };
  }

  @SwaggerAPI('/api/v1/theme/{id}', 'get', {
    tags: [ 'Theme' ],
    summary: 'detail',
    parameters: [
      {
        in: 'path',
        name: 'id',
        type: 'string',
        required: true,
      },
    ],
    responses: {
      '200': {
        schema: {
          $ref: '#/definitions/ThemeEntity',
        },
        description: ''
      }
    },
    security: [{
      accessToken: []
    }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/:id')
  async detail(
    @RequestParams.Params('id') id: string
  ): Promise<ThemeDO | undefined> {
    return await this.service.find(id);
  }

  @SwaggerAPI('/api/v1/theme/{id}', 'put', {
    tags: [ 'Theme' ],
    summary: 'update',
    parameters: [
      {
        in: 'path',
        name: 'id',
        type: 'string',
        required: true,
      },
      {
        in: 'body',
        name: 'ThemeUpdateDto',
        required: true,
        schema: {
          $ref: '#/definitions/ThemeUpdateDto'
        }
      }
    ],
    responses: {
      '200': {
        schema: {
          type: 'object'
        },
        description: ''
      }
    },
    security: [{
      accessToken: []
    }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('/:id')
  async update(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Params('id') id: string,
    @RequestParams.Params() @RequestValidator(ThemeDO) dto: ThemeDO,
  ): Promise<{}> {
    const accessData = ctx.accessData as PPAccessData;
    const appId = accessData.get<string>('appId');
    await this.service.update(id, {
      ...dto,
    });

    return {};
  }

  @SwaggerAPI('/api/v1/theme/{id}', 'delete', {
    tags: [ 'Theme' ],
    summary: 'delete',
    parameters: [
      {
        in: 'path',
        name: 'id',
        type: 'string',
        required: true,
      },
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
        },
        description: ''
      }
    },
    security: [{
      accessToken: []
    }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/:id')
  async delete(
    @RequestParams.Params('id') id: string): Promise<{}> {
    await this.service.delete(id);
    return {};
  }

  @SwaggerAPI('/api/v1/theme-bundle/{appNo}/{theme}', 'get', {
    tags: [ 'Theme' ],
    summary: 'theme bundle',
    parameters: [
      {
        in: 'path',
        name: 'appNo',
        type: 'string',
        required: true,
      },
      {
        in: 'path',
        name: 'theme',
        type: 'string',
        required: true,
      },
    ],
    responses: {
      '200': {
        schema: {
          $ref: '#/definitions/I18nEntity',
        },
        description: ''
      }
    },
  })
  @RequestMapping.Get('/theme-bundle/:appNo/:theme')
  async themeBundle(
    @RequestParams.Params() @RequestValidator(ThemeDO) dto: ThemeDO
    ): Promise<ThemeDO | undefined> {
    return this.service.findOne(dto);
  }
}
