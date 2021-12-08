import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { SessionService } from '../../../domain/service/SessionService';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { LoginDto } from '../dto/LoginDto';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';

@Prefix('/api/v1/authorization/session')
@Provider()
export class SessionController {
  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(SessionService)
  private sessionService!: SessionService;

  @RequestMapping.Post('auth')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body()
    @RequestValidator(LoginDto)
    loginDTO: LoginDto,
  ): Promise<Record<string, string | boolean>> {
    const stepData = await this.sessionService.auth(ctx, loginDTO as LoginDto);
    return {
      token: stepData.token,
      twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    };
  }

  @RequestMapping.Post('')
  @KoaStepTokenMiddleware('login', 'end')
  async create(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    const accessData = await this.sessionService.createAccessData(ctx);
    ctx.set('Set-Authorization', accessData.token);
    ctx.stepData = null;
    return {
      token: accessData.token,
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('')
  // eslint-disable-next-line @typescript-eslint/ban-types
  async delete(@RequestParams.Context() ctx: KoaContext): Promise<{}> {
    ctx.accessData = null;
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async show(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    return accessData.toJSON();
  }
}
