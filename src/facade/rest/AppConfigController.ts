import { AppConfigEntity } from '@/domain/model/AppConfigEntity';
import { AppConfigService } from '@/domain/service/AppConfigService';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDto } from '../dto/OrderDto';
import { PaginationDto } from '../dto/PaginationDto';

@SwaggerTag({ name: 'AppConfig', description: '`AppConfig` Entity'})
@Prefix('/api/v1/app-config')
@Provider()
export class AppConfigController {

  @Inject(AppConfigService)
  service!: AppConfigService;

  @SwaggerAPI('/api/v1/app-config', 'post', {
    tags: [ 'AppConfig' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: { $ref: '#/definitions/AppConfigEntity' }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/AppConfigEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body() @RequestValidator(AppConfigEntity) createDto: AppConfigEntity
    ): Promise<AppConfigEntity> {
    return await this.service.create({
      ...createDto,
      appId,
    });
  }

  @SwaggerAPI('/api/v1/app-config/{id}', 'put', {
    tags: [ 'AppConfig' ],
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
        name: 'data',
        required: true,
        schema: { $ref: '#/definitions/AppConfigEntity' }
      }
    ],
    responses: {
      '200': {
        schema: { type: 'object' },
        description: ''
      }
    },
    security: [{ accessToken: []}]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('/:id')
  async update(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('id') id: string,
    @RequestParams.Body() @RequestValidator(AppConfigEntity) updateDto: AppConfigEntity
    ): Promise<{}> {
    await this.service.update({ id, appId }, { ...updateDto });
    return {};
  }

  @SwaggerAPI('/api/v1/app-config/list', 'post', {
    tags: [ 'AppConfig' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'list',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: '#/definitions/AppConfigEntity' },
            pagination: { $ref: '#/definitions/PaginationDto' },
            order: { $ref: '#/definitions/OrderDto' }
          }
        }
      }
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            list: {
              type: 'array',
              items: { $ref: '#/definitions/AppConfigEntity' }
            }
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('list')
  async list(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body('query') @RequestValidator(AppConfigEntity) queryDto: AppConfigEntity,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDto) paginationDto: PaginationDto,
    @RequestParams.Body('order') @RequestValidator(OrderDto) orderDto: OrderDto,
  ): Promise<{ list: AppConfigEntity[], count: number }> {
    const [list, count] = await this.service.findMany({
      ...queryDto,
      appId
    }, {
      pagination: paginationDto,
      order: orderDto,
    });

    return {
      list,
      count,
    };
  }

  @SwaggerAPI('/api/v1/app-config/{id}', 'get', {
    tags: [ 'AppConfig' ],
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
        schema: { $ref: '#/definitions/AppConfigEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/:id')
  async detail(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('id') id: string
  ): Promise<AppConfigEntity | undefined> {
    return await this.service.findOne({ id, appId, });
  }

  @SwaggerAPI('/api/v1/app-config/{id}', 'delete', {
    tags: [ 'AppConfig' ],
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
        schema: { type: 'object' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/:id')
  async delete(
    @RequestParams.Params('id') id: string,
    @RequestAccessDataValue('appId') appId: string
    ): Promise<{}> {
      await this.service.delete({ id, appId });
      return {};
  }
}
