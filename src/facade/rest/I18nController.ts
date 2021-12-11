import { I18nEntity } from '@/domain/model/I18nEntity';
import { I18nService } from '@/domain/service/I18nService';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestAppId } from '@/util/decorator/RequestAppId';
import { RequestAppLocale } from '@/util/decorator/RequestAppLocale';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDto } from '../dto/OrderDto';
import { PaginationDto } from '../dto/PaginationDto';

@SwaggerTag({ name: 'I18n'})
@Provider()
@Prefix('/api/v1/i18n')
export class I18nController {

  @Inject(I18nService)
  private service!: I18nService;

  @SwaggerAPI('/api/v1/i18n', 'post', {
    tags: [ 'I18n' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: { $ref: '#/definitions/I18nEntity' }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/I18nEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body() @RequestValidator(I18nEntity) createDto: I18nEntity
    ): Promise<I18nEntity> {
    return await this.service.create({
      ...createDto,
      appId,
    });
  }

  @SwaggerAPI('/api/v1/i18n/{id}', 'get', {
    tags: [ 'I18n' ],
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
        schema: { $ref: '#/definitions/I18nEntity' },
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
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('id') id: string
  ): Promise<I18nEntity | undefined> {
    return await this.service.findOne({ id, appId, });
  }

  @SwaggerAPI('/api/v1/i18n/{id}', 'put', {
    tags: [ 'I18n' ],
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
        schema: { $ref: '#/definitions/I18nEntity' },
      }
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
  @RequestMapping.Put('/:id')
  async update(
    @RequestParams.Params('id') id: string,
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body() @RequestValidator(I18nEntity) dto: I18nEntity
    ): Promise<{}> {
    await this.service.update({ id, appId }, dto);
    return {};
  }

  @SwaggerAPI('/api/v1/i18n/list', 'post', {
    tags: [ 'I18n' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'list',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: '#/definitions/I18nEntity' },
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
            count: {
              type: 'number',
            },
            list: {
              type: 'array',
              items: {
                $ref: '#/definitions/I18nEntity',
              }
            }
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: []}]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body('query') @RequestValidator(I18nEntity) queryDto: I18nEntity,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDto) paginationDto: PaginationDto,
    @RequestParams.Body('order') @RequestValidator(OrderDto) orderDto: OrderDto,
    ): Promise<{ list: I18nEntity[]; count: number }> {
    const [list, count] = await this.service.findMany({
      ...queryDto,
      appId,
    }, {
      pagination: paginationDto,
      order: orderDto,
    });

    return {
      list,
      count,
    };
  }

  @SwaggerAPI('/api/v1/i18n/{id}', 'delete', {
    tags: [ 'I18n' ],
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
    security: [{ accessToken: []}]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/:id')
  async delete(
    @RequestParams.Params('id') id: string,
    @RequestAccessDataValue('appId') appId: string,
  ): Promise<{}> {
    await this.service.delete({ id, appId });
    return {};
  }

  @SwaggerAPI('/api/v1/message-bundle', 'post', {
    tags: [ 'I18n' ],
    summary: 'get the message bundle from the app',
    parameters: [
      {
        in: 'body',
        name: 'data',
        schema: { type: 'object' },
        required: true,
      },
      {
        in: 'header',
        name: 'app-id',
        required: true,
        type: 'string'
      },
      {
        in: 'header',
        name: 'app-locale',
        required: true,
        type: 'string'
      }
    ],
    responses: {
      '200': {
        schema: { type: 'object' },
        description: ''
      }
    },
  })
  @RequestMapping.Get('/i18n/message-bundle')
  async messageBundle(
    @RequestAppLocale() locale: string,
    @RequestAppId() appId: string,
    @RequestParams.Body() queryDto: Record<string, string>
    ): Promise<Record<string, string>> {
    // return this.service.findOne(dto);
    return {};
  }
}
