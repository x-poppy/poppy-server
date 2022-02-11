import { CustomizedServiceCode } from "@/domain/model/CustomizedServiceDO";
import { CustomizedServiceService } from "@/domain/service/CustomizedServiceService";
import { AvatarServiceAdapter } from "@/domain/service/customizedServiceAdapter/AvatarServiceAdapter";
import { RequestAccessDataValue } from "@/util/decorator/RequestAccessData";
import { Inject, Provider } from "@augejs/core";
import { KoaContext, Prefix, RequestMapping, RequestParams } from "@augejs/koa";
import { KoaAccessTokenMiddleware } from "@augejs/koa-access-token";
import { SwaggerAPI } from "@augejs/koa-swagger";
import { ImageVO } from "../vo/ImageVO";

@Prefix('/api/v1/avatar')
@Provider()
export class AvatarController {

  @Inject(CustomizedServiceService)
  private customizedServiceService!: CustomizedServiceService;

  @SwaggerAPI('/api/v1/avatar', 'get', {
    tags: [ 'Avatar' ],
    summary: 'avatar list',
    parameters: [
      {
        in: 'query',
        name: 'category',
        required: false,
        type: 'string'
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
              items: { $ref: `#/definitions/${ImageVO.name}` }
            }
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('category') category: string,
    @RequestAccessDataValue('appId') appId: string
  ): Promise<ImageVO[]> {
    const avatarServiceDO = await this.customizedServiceService.findAndVerify(appId, CustomizedServiceCode.Avatar, true);
    if (!avatarServiceDO) return [];

    const avatarService = await this.customizedServiceService.findAndVerifyServiceAdapter<AvatarServiceAdapter>(avatarServiceDO);
    if (!avatarService) return [];

    return avatarService.list(ctx, avatarServiceDO, { category });
  }
}
