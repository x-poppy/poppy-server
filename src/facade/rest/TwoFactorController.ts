import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaStepTokenMiddleware } from '@augejs/koa-step-token';
import { TwoFactorService } from '@/domain/service/TwoFactorService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { TwoFactorAuthDto } from '../dto/TwoFactorAuthDto';

const SupportSessionNames = ['login', 'changePassword', 'forgetPassword', 'resetPasswordInvite', 'resetPassword'];

@Prefix('/api/v1/authorization/two-factor')
@Provider()
export class TwoFactorController {
  @Inject(TwoFactorService)
  twoFactorService!: TwoFactorService;

  @KoaStepTokenMiddleware(SupportSessionNames, 'twoFactorList')
  @RequestMapping.Get('')
  async list(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    const stepData = await this.twoFactorService.list(ctx);
    ctx.stepData = null;
    return {
      token: stepData.token,
      list: stepData.get<Record<string, boolean>>('twoFactorAuthList'),
    };
  }

  @KoaStepTokenMiddleware(SupportSessionNames, 'twoFactorAuth')
  @RequestMapping.Post('')
  async auth(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Body() @RequestValidator(TwoFactorAuthDto) twoFactorAuthDto: TwoFactorAuthDto,
  ): Promise<Record<string, string>> {
    const stepData = await this.twoFactorService.auth(ctx, twoFactorAuthDto);
    ctx.stepData = null;
    return {
      token: stepData.token,
    };
  }
}
