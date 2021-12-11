import { UserAvatarService } from "@/domain/service/UserAvatarService";
import { RequestAppId } from "@/util/decorator/RequestAppId";
import { Inject, Provider } from "@augejs/core";
import { KoaContext, Prefix, RequestMapping, RequestParams } from "@augejs/koa";
import { SwaggerAPI } from "@augejs/koa-swagger";

@Prefix('/api/v1/user-avatar')
@Provider()
export class UserAvatarController {

  @Inject(UserAvatarService)
  private service!: UserAvatarService;

  @SwaggerAPI('/api/v1/user-avatar', 'get', {
    tags: [ 'User' ],
    summary: 'user-avatar list',
    parameters: [
      {
        in: 'path',
        name: 'query',
        required: true,
      },
      {
        in: 'header',
        name: 'app-id',
        required: true,
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
              items: { $ref: '#/definitions/UserEntity' }
            }
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @RequestMapping.Post('list')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestAppId() appId: string,
  ): Promise<any> {
    return this.service.list(ctx, appId);
  }
}
