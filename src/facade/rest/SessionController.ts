import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { SessionService } from '../../domain/service/SessionService';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { SessionLoginDto } from '../dto/SessionDto';
import { RequestAppId } from '@/util/decorator/RequestAppId';

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
          $ref: '#/definitions/SessionLoginDto'
        }
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
            token: { type: 'string' },
            needTwoFactorAuth: { type: 'boolean' }
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
    @RequestParams.Body() @RequestValidator(SessionLoginDto) sessionLoginDto: SessionLoginDto,
  ): Promise<{token: string, needTwoFactorAuth: boolean }> {
    const stepData = await this.service.auth(ctx, appId, sessionLoginDto);
    return {
      token: stepData.token,
      needTwoFactorAuth: stepData.get<boolean>('needTwoFactorAuth'),
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
          type: 'object',
          properties: {
            token: { type: 'string' },
          }
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @RequestMapping.Post('')
  @KoaStepTokenMiddleware('login', 'end')
  async create(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    const accessData = await this.service.createAccessData(ctx);
    ctx.set('Set-Authorization', accessData.token);
    ctx.stepData = null;
    return {
      token: accessData.token,
    };
  }

  @SwaggerAPI('/api/v1/session', 'get', {
    tags: [ 'Session' ],
    summary: 'detail',
    responses: {
      '200': {
        schema: {
          type: 'object'
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async detail(
    @RequestParams.Context() ctx: KoaContext
    ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    return accessData.toJSON();
  }

  @SwaggerAPI('/api/v1/session', 'delete', {
    tags: [ 'Session' ],
    summary: 'delete',
    responses: {
      '200': {
        schema: {
          type: 'object'
        },
        description: ''
      }
    },
    security: [{ accessToken: [] }]
  })
  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('')
  async delete(@RequestParams.Context() ctx: KoaContext): Promise<{}> {
    ctx.accessData = null;
    return {};
  }
}
