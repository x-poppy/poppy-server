import { ForgetPasswordService } from '@/domain/service/ForgetPasswordService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { LoginDto } from '../dto/LoginDto';

@Prefix('/api/v1/user/forget-password')
@Provider()
export class ForgetPasswordController {
  @Inject(ForgetPasswordService)
  private forgetPasswordService!: ForgetPasswordService;

  @RequestMapping.Post('auth')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body()
    @RequestValidator(LoginDto)
    forgetPasswordDto: LoginDto,
  ): Promise<Record<string, string | boolean>> {
    const stepData = await this.forgetPasswordService.auth(ctx, forgetPasswordDto);
    return {
      token: stepData.token,
      twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    };
  }

  @KoaStepTokenMiddleware('forgetPassword', 'end')
  @RequestMapping.Put('')
  async update(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, string | boolean>> {
    await this.forgetPasswordService.update(ctx);
    // rm the step token
    ctx.stepData = null;
    return {};
  }
}
