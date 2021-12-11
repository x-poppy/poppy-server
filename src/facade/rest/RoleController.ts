import { RoleEntity } from '@/domain/model/RoleEntity';
import { RoleService } from '@/domain/service/RoleService';
import { RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { OrderDto } from '../dto/OrderDto';
import { PaginationDto } from '../dto/PaginationDto';

@SwaggerTag({ name: 'Role', description: '`Role` Entity'})
@Prefix('/api/v1/role')
@Provider()
export class RoleController {

  @Inject(RoleService)
  service!: RoleService;

  @SwaggerAPI('/api/v1/role', 'post', {
    tags: [ 'Role' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: { $ref: '#/definitions/RoleEntity' }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: '#/definitions/RoleEntity' },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestAccessDataValue('userRoleId') userRoleId: string,
    @RequestAccessDataValue('userRoleLevel') userRoleLevel: number,
    @RequestParams.Body() @RequestValidator(RoleEntity) dto: RoleEntity
  ): Promise<RoleEntity> {
    return await this.service.create({
      ...dto,
      parent: userRoleId,
      level: userRoleLevel + 1,
      appId,
    });
  }

  @SwaggerAPI('/api/v1/Role/{id}', 'get', {
    tags: [ 'Role' ],
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
        schema: { $ref: '#/definitions/RoleEntity' },
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
  ): Promise<RoleEntity | undefined> {
    return await this.service.findOne({ id, appId });
  }

  @SwaggerAPI('/api/v1/role/list', 'post', {
    tags: [ 'Role' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'list',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: '#/definitions/RoleEntity' },
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
              items: { $ref: '#/definitions/RoleEntity' }
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
    @RequestAccessDataValue('userRoleLevel') userRoleLevel: number,
    @RequestParams.Body('query') @RequestValidator(RoleEntity) queryDto: RoleEntity,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDto) paginationDto: PaginationDto,
    @RequestParams.Body('order') @RequestValidator(OrderDto) orderDto: OrderDto,
  ): Promise<{ list: RoleEntity[], count: number }> {
    const [list, count] = await this.service.findMany({
      ...queryDto,
      level: userRoleLevel,
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

  @SwaggerAPI('/api/v1/role/{id}', 'put', {
    tags: [ 'Role' ],
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
        name: 'RoleEntity',
        required: true,
        schema: {
          $ref: '#/definitions/RoleEntity'
        }
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
  @RequestMapping.Put('')
  async update(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('id') id: string,
    @RequestParams.Body() @RequestValidator(RoleEntity) dto: RoleEntity
  ): Promise<{}> {
    await this.service.update({ id, appId }, { ...dto });
    return {};
  }

  @SwaggerAPI('/api/v1/role/{id}', 'delete', {
    tags: [ 'Role' ],
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
}
