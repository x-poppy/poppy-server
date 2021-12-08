import { ResetPasswordInviteService } from '@/domain/service/ResetPasswordInviteService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { RestPasswordInviteDto } from '../dto/RestPasswordInviteDto';

@Prefix('/api/v1/user/rest-password-invite')
@Provider()
export class RestPasswordInviteController {
  @Inject(ResetPasswordInviteService)
  resetPasswordInviteService!: ResetPasswordInviteService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('auth')
  async auth(
    @RequestParams.Context() ctx: KoaContext,

    @RequestParams.Body()
    @RequestValidator(RestPasswordInviteDto)
    restPasswordInviteDto: RestPasswordInviteDto,
  ): Promise<Record<string, unknown>> {
    const stepData = await this.resetPasswordInviteService.auth(ctx, restPasswordInviteDto);
    return {
      token: stepData.token,
      twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  @KoaStepTokenMiddleware('resetPasswordInvite', 'end')
  async update(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    const stepData = await this.resetPasswordInviteService.invite(ctx);
    const resetPasswordLinkAddress = stepData.get<string>('resetPasswordLinkAddress');
    ctx.stepData = null;
    return {
      resetPasswordLinkAddress,
    };
  }
}
