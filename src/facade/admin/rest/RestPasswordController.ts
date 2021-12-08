import { ResetPasswordInviteService } from '@/domain/service/ResetPasswordInviteService';
import { ResetPasswordService } from '@/domain/service/ResetPasswordService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { ResetPasswordDto } from '../dto/ResetPasswordDto';

@Prefix('/api/v1/user/rest-password')
@Provider()
export class RestPasswordController {
  @Inject(ResetPasswordService)
  resetPasswordService!: ResetPasswordService;

  @KoaStepTokenMiddleware('resetPassword', 'end')
  @RequestMapping.Post('')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body()
    @RequestValidator(ResetPasswordDto)
    resetPasswordDto: ResetPasswordDto,
  ): Promise<Record<string, unknown>> {
    await this.resetPasswordService.update(ctx, resetPasswordDto);
    // rm the step token
    ctx.stepData = null;
    return {};
  }
}
