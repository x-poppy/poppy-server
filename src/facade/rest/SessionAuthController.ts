import { SessionAuthService } from '@/domain/service/SessionAuthService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { LoginDto } from '../dto/LoginDto';

@Prefix('/api/v1/authorization/session-auth')
@Provider()
export class SessionAuthController {
  @Inject(SessionAuthService)
  private authService!: SessionAuthService;

  @RequestMapping.Post('')
  async auth(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body() @RequestValidator(LoginDto) loginDTO: LoginDto): Promise<Record<string, string | boolean>> {
    const sessionData = await this.authService.auth(ctx, loginDTO as LoginDto);
    return {
      token: sessionData.token,
      userNo: sessionData.get<string>('userNo'),
      twoFactorAuth: sessionData.get<boolean>('twoFactorAuth'),
    };
  }
}
