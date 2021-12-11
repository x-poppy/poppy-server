import { UserEntity } from '@/domain/model/UserEntity';
import { UserService } from '@/domain/service/UserService';
import { DecodeURIComponent } from '@/util/decorator/DecodeURIComponent';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestAppId } from '@/util/decorator/RequestAppId';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDto } from '../dto/OrderDto';
import { PaginationDto } from '../dto/PaginationDto';
import { UserCreateDto } from '../dto/UserDto';

@SwaggerTag({ name: 'User', description: '`User` Entity'})
@Prefix('/api/v1/user')
@Provider()
export class UserController {

  @Inject(UserService)
  private service!: UserService;

  @SwaggerAPI('/api/v1/user', 'post', {
    tags: [ 'User' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: { $ref: '#/definitions/UserCreateDto' }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/UserEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body() @RequestValidator(UserCreateDto) dto: UserCreateDto): Promise<UserEntity> {
      dto.appId = appId;
    return await this.service.createUser(dto);
  }

  @SwaggerAPI('/api/v1/user/list', 'post', {
    tags: [ 'User' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'query',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: '#/definitions/UserEntity' },
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
              items: { $ref: '#/definitions/UserEntity' }
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
    @RequestParams.Body('query') @RequestValidator(UserEntity) queryDto: UserEntity,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDto) paginationDto: PaginationDto,
    @RequestParams.Body('order') @RequestValidator(OrderDto) orderDto: OrderDto,
  ): Promise<Record<string, unknown>> {
    const [list, count] = await this.service.findMany({
      ...queryDto,
      appId,
    }, {
      pagination: paginationDto,
      order: orderDto
    });

    return {
      list,
      count,
    };
  }

  @SwaggerAPI('/api/v1/user/{id}', 'put', {
    tags: [ 'User' ],
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
        schema: { $ref: '#/definitions/UserEntity' }
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
    @RequestParams.Body() @RequestValidator(UserEntity) dto: UserEntity
    ): Promise<{}> {
    await this.service.update({ id, appId }, { ...dto });
    return {};
  }

  @SwaggerAPI('/api/v1/user/{id}', 'get', {
    tags: [ 'User' ],
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
        schema: { $ref: '#/definitions/UserEntity' },
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
  ): Promise<UserEntity | undefined> {
    return await this.service.findOne({ id, appId, });
  }

  @SwaggerAPI('/api/v1/user/{id}', 'delete', {
    tags: [ 'User' ],
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
    @RequestAccessDataValue('appId') appId: string,
  ): Promise<{}> {
    await this.service.delete({ id, appId });
    return {};
  }

  @SwaggerAPI('/api/v1/user/available-account/{accountName}', 'get', {
    tags: [ 'User' ],
    summary: 'check account name',
    parameters: [
      {
        in: 'path',
        name: 'accountName',
        required: true,
        type: 'string'
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
  @RequestMapping.Get('/available-account/:accountName')
  async checkAccountNameAvailable(
    @RequestAppId() appId: string,
    @RequestParams.Params('accountName') @DecodeURIComponent() accountName: string,
  ): Promise<{}> {
    const result = await this.service.checkAccountNameAvailable(appId, accountName);
    return {
      available: result,
    };
  }
}
