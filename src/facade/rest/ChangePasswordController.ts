import { ChangePasswordService } from '@/domain/service/ChangePasswordService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { LoginDto } from '../dto/LoginDto';

@Prefix('/api/v1/authorization/change-password')
@Provider()
export class ChangePasswordController {
  @Inject(ChangePasswordService)
  private changePasswordService!: ChangePasswordService;

  @RequestMapping.Post('auth')
  async auth(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body('password') password: string): Promise<Record<string, string | boolean>> {
    const stepData = await this.changePasswordService.auth(ctx, password);
    return {
      token: stepData.token,
      twoFactorAuth: stepData.get<boolean>('twoFactorAuth'),
    };
  }

  @KoaStepTokenMiddleware('changePassword', 'end')
  @RequestMapping.Put('')
  async update(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, string | boolean>> {
    await this.changePasswordService.update(ctx);
    return {};
  }
}
