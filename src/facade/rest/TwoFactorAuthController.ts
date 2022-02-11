import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaStepTokenMiddleware, StepData } from '@augejs/koa-step-token';
import { TwoFactorAuthService } from '@/domain/service/TwoFactorAuthService';
import { TwoFactorAuthDTO } from '../dto/TwoFactorAuthDTO';
import { SwaggerAPI, SwaggerTag } from '@augejs/koa-swagger';
import { TwoFactorAuthInfoBO } from '@/domain/bo/TwoFactorAuthInfoBO';
import { RequestStepData } from '@/util/decorator/RequestStepData';
import { RequestValidator } from '@/util/decorator/RequestValidator';
import { KoaLimitRequestMiddleware } from '@augejs/koa-limit-request';

const SupportSessionNames = ['login', 'changePassword', 'forgetPassword', 'resetPasswordInvite', 'resetPassword'];

@SwaggerTag({ name: 'TwoFactorAuth', description: '`TwoFactor'})
@Prefix('/api/v1/two-factor-auth')
@Provider()
export class TwoFactorAuthController {

  @Inject(TwoFactorAuthService)
  service!: TwoFactorAuthService;

  @SwaggerAPI('/api/v1/two-factor-auth/info', 'get', {
    tags: [ 'TwoFactorAuth' ],
    summary: 'info',
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
        schema: { $ref: `#/definitions/${TwoFactorAuthInfoBO.name}` },
        description: ''
      }
    },
  })
  @KoaStepTokenMiddleware(SupportSessionNames)
  @RequestMapping.Get('/info')
  async info(
    @RequestStepData() stepData: StepData
    ): Promise<TwoFactorAuthInfoBO> {
    const twoFactorAuthInfoBO = await this.service.info(stepData);
    await stepData.active();
    return twoFactorAuthInfoBO;
  }

  @SwaggerAPI('/api/v1/two-factor-auth/captcha', 'post', {
    tags: [ 'TwoFactorAuth' ],
    summary: 'captcha',
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
        schema: { $ref: `#/definitions/${TwoFactorAuthInfoBO.name}` },
        description: ''
      }
    },
  })
  @KoaStepTokenMiddleware(SupportSessionNames)
  @KoaLimitRequestMiddleware({
    limitTime: '60s'
  })
  @RequestMapping.Post('/captcha')
  async captcha(
    @RequestStepData() stepData: StepData
    ): Promise<{}> {
    let captcha = await this.service.sendCaptcha(stepData);
    if (process.env.NODE_ENV === 'production') {
      captcha = '******';
    }
    await stepData.active();
    return {
      captcha
    };
  }

  @SwaggerAPI('/api/v1/two-factor-auth/auth', 'post', {
    tags: [ 'TwoFactorAuth' ],
    summary: 'auth',
    parameters: [
      {
        in: 'header',
        name: 'step-token',
        required: true,
        type: 'string'
      },
      {
        in: 'body',
        name: 'data',
        required: true,
        schema: {
          $ref: `#/definitions/${TwoFactorAuthDTO.name}`
        }
      }
    ],
    responses: {
      '200': {
        schema: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        description: ''
      }
    },
  })
  @KoaStepTokenMiddleware(SupportSessionNames, 'twoFactorAuth')
  @RequestMapping.Post('/auth')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body() @RequestValidator(TwoFactorAuthDTO) twoFactorAuthDTO: TwoFactorAuthDTO,
  ): Promise<Record<string, string>> {
    const stepData = await this.service.auth(ctx, twoFactorAuthDTO);
    ctx.stepData = null;
    return {
      token: stepData.token,
    };
  }
}
