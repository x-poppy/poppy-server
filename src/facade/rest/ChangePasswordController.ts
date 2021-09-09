import { ChangePasswordService } from '@/domain/service/ChangePasswordService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';

@Prefix('/api/v1/user/change-password')
@Provider()
export class ChangePasswordController {
  @Inject(ChangePasswordService)
  private changePasswordService!: ChangePasswordService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('auth')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body()
    @RequestValidator(ChangePasswordDto)
    changePasswordDto: ChangePasswordDto,
  ): Promise<Record<string, string | boolean>> {
    const stepData = await this.changePasswordService.auth(ctx, changePasswordDto);
    return {
      token: stepData.token,
      twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    };
  }

  @KoaAccessTokenMiddleware()
  @KoaStepTokenMiddleware('changePassword', 'end')
  @RequestMapping.Put('')
  async update(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, string | boolean>> {
    await this.changePasswordService.update(ctx);
    ctx.stepData = null;
    return {};
  }
}
