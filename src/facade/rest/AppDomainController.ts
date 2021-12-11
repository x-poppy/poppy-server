import { AppDomainEntity } from '@/domain/model/AppDomainEntity';
import { AppDomainService } from '@/domain/service/AppDomainService';
import { DecodeURIComponent } from '@/util/decorator/DecodeURIComponent';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDto } from '../dto/OrderDto';
import { PaginationDto } from '../dto/PaginationDto';

@SwaggerTag({ name: 'AppDomain', description: '`AppDomain` entity '})
@Prefix('/api/v1/app-domain')
@Provider()
export class AppDomainController {

  @Inject(AppDomainService)
  service!: AppDomainService;

  @SwaggerAPI('/api/v1/app-domain', 'post', {
    tags: [ 'AppDomain' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: { $ref: '#/definitions/AppDomainEntity' }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/AppDomainEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body('data') @RequestValidator(AppDomainEntity) createDto: AppDomainEntity
    ): Promise<AppDomainEntity> {
    return await this.service.create({
      ...createDto,
      appId,
    });
  }

  @SwaggerAPI('/api/v1/app-domain/{id}', 'put', {
    tags: [ 'AppDomain' ],
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
        schema: { $ref: '#/definitions/AppDomainEntity' }
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
    @RequestParams.Body('data') @RequestValidator(AppDomainEntity) updateDto: AppDomainEntity
    ): Promise<{}> {
    await this.service.update({ id, appId }, updateDto);
    return {};
  }

  @SwaggerAPI('/api/v1/app-domain/list', 'post', {
    tags: [ 'AppDomain' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'query',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: '#/definitions/AppDomainEntity' },
            pagination: { $ref: '#/definitions/PaginationDto' },
            order: { $ref: '#/definitions/OrderDto' }
          }
        }
      },

    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', },
            list: {
              type: 'array',
              items: { $ref: '#/definitions/AppDomainEntity' }
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
    @RequestParams.Body('query') @RequestValidator(AppDomainEntity) queryDto: AppDomainEntity,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDto) paginationDto: PaginationDto,
    @RequestParams.Body('order') @RequestValidator(OrderDto) orderDto: OrderDto,
  ): Promise< { list: AppDomainEntity[], count: number } > {
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

  @SwaggerAPI('/api/v1/app-domain/{id}', 'get', {
    tags: [ 'AppDomain' ],
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
        schema: { $ref: '#/definitions/AppDomainEntity' },
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
  ): Promise<AppDomainEntity | undefined> {
    return await this.service.findOne({ id, appId });
  }

  @SwaggerAPI('/api/v1/app-domain/{id}', 'delete', {
    tags: [ 'AppDomain' ],
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
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('id') id: string
    ): Promise<{}> {
      await this.service.delete({ id, appId });
      return {};
  }

  @SwaggerAPI('/api/v1/app-domain/app-id/{domain}', 'get', {
    tags: [ 'AppDomain' ],
    summary: 'get `app id` by domain',
    parameters: [
      {
        in: 'path',
        name: 'domain',
        type: 'string',
        required: true,
        description: 'the domain should use `encodeURIComponent` in the client side and use `decodeURIComponent` in the server side. \n > 127.0.0.1%3A7001'
      },
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            appId: {
              type: 'string'
            }
          }
        },
        description: ''
      }
    },
  })
  @RequestMapping.Get('/app-id/:domain')
  async detailByDomain(
    @RequestParams.Params('domain') @DecodeURIComponent() domain: string
  ): Promise<{appId: string | null}> {
    const appId = await this.service.findAppIdByDomain(domain);
    return {
      appId: appId ?? null
    }
  }

  @SwaggerAPI('/api/v1/app-domain/available-domain/{domain}', 'get', {
    tags: [ 'AppDomain' ],
    summary: 'check domain available',
    parameters: [
      {
        in: 'path',
        name: 'domain',
        required: true,
        type: 'string',
      },
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            available: { type: 'boolean' },
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/app-domain/available-domain/:domain')
  async checkDomainAvailable(
    @RequestParams.Params('domain') @DecodeURIComponent() domain: string,
  ): Promise<{}> {
    const result = await this.service.checkDomainAvailable(domain);
    return {
      available: result,
    };
  }
}
