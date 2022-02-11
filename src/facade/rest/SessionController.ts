import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { SessionService } from '../../domain/service/SessionService';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { SessionLoginDTO } from '../dto/SessionDTO';
import { RequestAppId } from '@/util/decorator/RequestAppId';
import { RequestAccessDataDTO, RequestAccessDataValue } from '@/util/decorator/RequestAccessData';
import { AccessDataDTO } from '../dto/AccessDataDTO';
import { TwoFactorAuthType } from '@/domain/model/UserCredentialDO';
import { TwoFactorAuthInfoBO } from '@/domain/bo/TwoFactorAuthInfoBO';

@SwaggerTag({ name: 'Session', description: 'A unique identifier object after `user` authentication'})
@Prefix('/api/v1/session')
@Provider()
export class SessionController {

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(SessionService)
  private service!: SessionService;

  @SwaggerAPI('/api/v1/session/auth', 'post', {
    tags: [ 'Session' ],
    summary: 'login',
    parameters: [
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: {
          $ref: `#/definitions/${SessionLoginDTO.name}`
        }
      },
      {
        in: 'header',
        name: 'app-id',
        required: true,
        type: 'string',
      }
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            twoFactorAuthType: { type: 'string' }
          }
        },
        description: ''
      }
    }
  })
  @RequestMapping.Post('/auth')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestAppId() appId: string,
    @RequestParams.Body() @RequestValidator(SessionLoginDTO) sessionLoginDto: SessionLoginDTO,
  ): Promise<{token: string, needTwoFactorAuth: boolean }> {
    const stepData = await this.service.auth(ctx, appId, sessionLoginDto);
    const needTwoFactorAuth = stepData.get<TwoFactorAuthInfoBO>('twoFactorAuthInfo').type !== TwoFactorAuthType.NONE;
    return {
      token: stepData.token,
      needTwoFactorAuth,
    };
  }

  @SwaggerAPI('/api/v1/session', 'post', {
    tags: [ 'Session' ],
    summary: 'create',
    parameters: [
      {
        in: 'header',
        name: 'step-token',
        required: true,
        type: 'string'
      }
    ],
    responses: {
      '200': {
        schema: {
          $ref: `#/definitions/${AccessDataDTO.name}`,
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @RequestMapping.Post('')
  @KoaStepTokenMiddleware('login', 'end')
  async create(@RequestParams.Context() ctx: KoaContext): Promise<AccessDataDTO> {
    const accessData = await this.service.createAccessData(ctx);
    ctx.set('Set-Authorization', accessData.token);
    ctx.stepData = null;
    return AccessDataDTO.fromAccessData(accessData);
  }

  @SwaggerAPI('/api/v1/session', 'get', {
    tags: [ 'Session' ],
    summary: 'detail',
    responses: {
      '200': {
        schema: {
          $ref: `#/definitions/${AccessDataDTO.name}`,
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async detail(
    @RequestAccessDataDTO() accessDataDTO: AccessDataDTO
    ): Promise<AccessDataDTO> {
    return accessDataDTO;
  }

  @SwaggerAPI('/api/v1/session/list', 'get', {
    tags: [ 'Session' ],
    summary: 'list',
    responses: {
      '200': {
        schema: {
          type: 'array',
          items: {
            $ref: `#/definitions/${AccessDataDTO.name}`,
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('list')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestAccessDataValue('userId') userId: string
    ): Promise<AccessDataDTO[]> {
    const accessDataList = await ctx.findAccessDataListByUserId(userId, { incudesCurrent : true });
    return accessDataList.map((accessData) => AccessDataDTO.fromAccessData(accessData));
  }

  @SwaggerAPI('/api/v1/session', 'delete', {
    tags: [ 'Session' ],
    summary: 'delete',
    parameters: [
      {
        in: 'header',
        name: 'token',
        required: false,
        type: 'string'
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
  @RequestMapping.Delete('')
  async delete(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Header('token') token: string
  ): Promise<{}> {
    if (!token || ctx.accessData?.token === token) {
      ctx.accessData = null;
    }
    await ctx.deleteAccessData(token);
    return {};
  }
}


