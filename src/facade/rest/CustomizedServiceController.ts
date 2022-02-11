import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { CustomizedServiceService } from "@/domain/service/CustomizedServiceService";
import { RequestAccessDataValue } from "@/util/decorator/RequestAccessData";
import { RequestValidator } from "@/util/decorator/RequestValidator";
import { Inject, Provider } from "@augejs/core";
import { KoaContext, Prefix, RequestMapping, RequestParams } from "@augejs/koa";
import { KoaAccessTokenMiddleware } from "@augejs/koa-access-token";
import { SwaggerAPI, SwaggerTag } from "@augejs/koa-swagger";
import { CustomizedServiceListDTO } from "../dto/CustomizedServiceDTO";
import { OrderDTO } from "../dto/OrderDTO";
import { PaginationDTO } from "../dto/PaginationDTO";

@SwaggerTag({ name: 'CustomizedService'})
@Provider()
@Prefix('/api/v1/customized-service')
export class CustomizedServiceController {

  @Inject(CustomizedServiceService)
  private readonly service!: CustomizedServiceService;

  @SwaggerAPI('/api/v1/customized-service', 'post', {
    tags: [ 'CustomizedService' ],
    summary: 'create',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: {
          $ref: `#/definitions/${CustomizedServiceDO.name}`
        }
      }
    ],
    responses: {
      '200': {
        schema: { $ref: `#/definitions/${CustomizedServiceDO.name}` },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Body() @RequestValidator(CustomizedServiceDO) createDTO: CustomizedServiceDO): Promise<CustomizedServiceDO> {
      return this.service.create({
        ...createDTO,
        mockResponse: createDTO.mockResponse && JSON.stringify(createDTO.mockResponse),
        appId,
      });
  }

  @SwaggerAPI('/api/v1/customized-service/{id}', 'put', {
    tags: [ 'CustomizedService' ],
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
        schema: { $ref: `#/definitions/${CustomizedServiceDO.name}` },
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
    @RequestParams.Body() @RequestValidator(CustomizedServiceDO) updateDto: CustomizedServiceDO
    ): Promise<{}> {
    await this.service.update({
      id,
    }, { ...updateDto });
    return {};
  }

  @SwaggerAPI('/api/v1/customized-service/list', 'post', {
    tags: [ 'CustomizedService' ],
    summary: 'list',
    parameters: [
      {
        in: 'body',
        name: 'list',
        required: true,
        schema: {
          type: 'object',
          properties: {
            query: { $ref: `#/definitions/${CustomizedServiceListDTO.name}` },
            pagination: { $ref: `#/definitions/${PaginationDTO.name}` },
            order: { $ref: `#/definitions/${OrderDTO.name}` }
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
              items: { $ref: `#/definitions/${CustomizedServiceDO.name}` }
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
    @RequestParams.Body('query') @RequestValidator(CustomizedServiceListDTO) queryDto: CustomizedServiceListDTO,
    @RequestParams.Body('pagination') @RequestValidator(PaginationDTO) paginationDto: PaginationDTO,
    @RequestParams.Body('order') @RequestValidator(OrderDTO) orderDto: OrderDTO,
  ): Promise<{ list: CustomizedServiceDO[], count: number }> {
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

  @SwaggerAPI('/api/v1/customized-service/{id}', 'get', {
    tags: [ 'CustomizedService' ],
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
        schema: { $ref: `#/definitions/${CustomizedServiceDO.name}` },
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
  ): Promise<CustomizedServiceDO | undefined> {
    return await this.service.findOne({ id, appId });
  }

  @SwaggerAPI('/api/v1/customized-service/{id}', 'delete', {
    tags: [ 'CustomizedService' ],
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

  @SwaggerAPI('/api/v1/customized-service/callback/{appId}/{serviceCode}', 'post', {
    tags: [ 'CustomizedService' ],
    summary: '',
    parameters: [
      {
        in: 'path',
        name: 'appId',
        type: 'string',
        required: true,
        description: 'appId'
      },
      {
        in: 'path',
        name: 'serviceCode',
        type: 'string',
        required: true,
        description: 'serviceCode'
      },
      {
        in: 'body',
        name: 'data',
        required: false,
        schema: {
          type: 'object',
        }
      }
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
  @RequestMapping.All('/callback/:appId/:serviceCode')
  async callback(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Params('appId') appId: string,
    @RequestParams.Params('serviceCode') serviceCode: string
  ): Promise<void> {
    await this.service.request(ctx, appId, serviceCode);
  }

  @SwaggerAPI('/api/v1/customized-service/proxy/{serviceCode}', 'post', {
    tags: [ 'CustomizedService' ],
    summary: '',
    parameters: [
      {
        in: 'path',
        name: 'serviceCode',
        type: 'string',
        required: true,
        description: 'serviceCode'
      },
      {
        in: 'body',
        name: 'data',
        required: false,
        schema: {
          type: 'object',
        }
      },
      {
        in: 'query',
        name: 'query',
        type: 'string'
      }
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
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.All('/proxy/:serviceCode')
  async proxy(
    @RequestParams.Context() ctx: KoaContext,
    @RequestAccessDataValue('appId') appId: string,
    @RequestParams.Params('serviceCode') serviceCode: string,
  ): Promise<void> {
    await this.service.request(ctx, appId, serviceCode);
  }
}
