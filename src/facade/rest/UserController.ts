import { UserDO } from '@/domain/model/UserDO';
import { UserService } from '@/domain/service/UserService';
import { DecodeURIComponent } from '@/util/decorator/DecodeURIComponent';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { maskEmail, maskPhone } from '@/util/MaskUtil';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDTO } from '../dto/OrderDTO';
import { PaginationDTO } from '../dto/PaginationDTO';
import { UserCreateDTO, UserListDTO } from '../dto/UserDTO';

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
        schema: { $ref: '#/definitions/UserCreateDTO' }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/UserDO' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body() @RequestValidator(UserCreateDTO) dto: UserCreateDTO): Promise<UserDO> {
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
            query: { $ref: '#/definitions/UserListDTO' },
            pagination: { $ref: '#/definitions/PaginationDTO' },
            order: { $ref: '#/definitions/OrderDTO' }
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
              items: { $ref: '#/definitions/UserDO' }
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
    @RequestParams.Body('query') @RequestValidator(UserListDTO) queryDTO: UserListDTO,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDTO) paginationDTO: PaginationDTO,
    @RequestParams.Body('order') @RequestValidator(OrderDTO) orderDTO: OrderDTO,
  ): Promise<{ list:UserDO[],count: number }> {
    const [list, count] = await this.service.findMany({
      ...queryDTO,
      appId,
    }, {
      pagination: paginationDTO,
      order: orderDTO
    });

    const maskedList = list.map<UserDO>(item => {
      item.emailAddr = maskEmail(item.emailAddr);
      item.mobileNo = maskPhone(item.mobileNo);
      return item;
    });

    return {
      list: maskedList,
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
        schema: { $ref: '#/definitions/UserDO' }
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
    @RequestParams.Body() @RequestValidator(UserDO) dto: UserDO
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
        schema: { $ref: `#/definitions/${UserDO.name}` },
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
  ): Promise<UserDO | undefined> {
    const userDO = await this.service.findOne({ id, appId, });
    if (userDO) {
      userDO.emailAddr = maskEmail(userDO.emailAddr);
      userDO.mobileNo = maskPhone(userDO.mobileNo);
    }

    return userDO;
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
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('accountName') @DecodeURIComponent() accountName: string,
  ): Promise<{}> {
    const result = await this.service.checkAccountNameAvailable(appId, accountName);
    return {
      available: result,
    };
  }
}
