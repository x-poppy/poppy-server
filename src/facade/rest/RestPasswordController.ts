import { ResetPasswordInviteService } from '@/domain/service/ResetPasswordInviteService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';

@Prefix('/api/v1/user/rest-password')
@Provider()
export class RestPasswordInviteController {
  @Inject(ResetPasswordInviteService)
  resetPasswordService!: ResetPasswordInviteService;

  @KoaStepTokenMiddleware('resetPassword', 'auth')
  @RequestMapping.Post('auth')
  async auth(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    // const stepData = await this.resetPasswordService.auth(ctx, userNo);
    // return {
    //   token: stepData.token,
    //   twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    // };
    // rm the step token
    ctx.stepData = null;
    return {};
  }

  @RequestMapping.Put('')
  @KoaStepTokenMiddleware('resetPassword', 'end')
  async update(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    // await this.resetPasswordService.update(ctx);
    // rm the step token
    ctx.stepData = null;
    return {};
  }
}
