import { ResetPasswordService } from '@/domain/service/ResetPasswordService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';

@Prefix('/api/v1/authorization/rest-password')
@Provider()
export class RestPasswordController {
  @Inject(ResetPasswordService)
  resetPasswordService!: ResetPasswordService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('auth')
  async auth(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body('userNo') userNo: string): Promise<Record<string, unknown>> {
    const stepData = await this.resetPasswordService.auth(ctx, userNo);
    return {
      token: stepData.token,
      twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    };
  }

  @RequestMapping.Put('verify')
  @KoaStepTokenMiddleware('resetPassword', 'verify')
  async verify(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    await this.resetPasswordService.verify(ctx);
    return {};
  }

  @RequestMapping.Put('')
  @KoaStepTokenMiddleware('resetPassword', 'end')
  async update(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    await this.resetPasswordService.update(ctx);
    return {};
  }
}
