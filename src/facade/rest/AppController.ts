import { AppEntity } from '@/domain/model/AppEntity';
import { AppService } from '@/domain/service/AppService';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDto } from '../dto/OrderDto';
import { PaginationDto } from '../dto/PaginationDto';

@SwaggerTag({ name: 'App', description: '`App` Entity'})
@Prefix('/api/v1/app')
@Provider()
export class AppController {

  @Inject(AppService)
  private service!: AppService;

  @SwaggerAPI('/api/v1/app', 'post', {
    tags: [ 'App' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: {
          $ref: '#/definitions/AppCreateDto'
        }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/AppEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestAccessDataValue('appLevel') appLevel: number,
    @RequestParams.Body() @RequestValidator(AppEntity) createDto: AppEntity): Promise<AppEntity> {
      return this.service.create({
        ...createDto,
        parent: appId,
        level: appLevel + 1,
      });
  }

  @SwaggerAPI('/api/v1/app/{id}', 'put', {
    tags: [ 'App' ],
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
        schema: { $ref: '#/definitions/AppEntity' }
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
    @RequestAccessDataValue('appLevel') appLevel: number,
    @RequestParams.Params('id') id: string,
    @RequestParams.Body() @RequestValidator(AppEntity) updateDto: AppEntity
    ): Promise<{}> {
    await this.service.update({
      id,
      level: appLevel,
    }, { ...updateDto });
    return {};
  }

  @SwaggerAPI('/api/v1/app/list', 'post', {
    tags: [ 'App' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'list',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: '#/definitions/AppEntity' },
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
              items: { $ref: '#/definitions/AppEntity' }
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
    @RequestParams.Body('query') @RequestValidator(AppEntity) queryDto: AppEntity,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDto) paginationDto: PaginationDto,
    @RequestParams.Body('order') @RequestValidator(OrderDto) orderDto: OrderDto,
  ): Promise<{ list: AppEntity[], count: number }> {
    const [list, count] = await this.service.findMany({
      ...queryDto,
      parent: appId,
    }, {
      pagination: paginationDto,
      order: orderDto,
    });

    return {
      list,
      count,
    };
  }

  @SwaggerAPI('/api/v1/app/{id}', 'get', {
    tags: [ 'App' ],
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
        schema: { $ref: '#/definitions/AppEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/:id')
  async detail(
    @RequestAccessDataValue('appLevel') appLevel: number,
    @RequestParams.Params('id') id: string
  ): Promise<AppEntity | undefined> {
    return await this.service.findOne({
      id,
      level: appLevel,
    });
  }

  @SwaggerAPI('/api/v1/app/{id}', 'delete', {
    tags: [ 'App' ],
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
      await this.service.delete({ id, parent: appId });
      return {};
  }
}
