import { AuthService } from '@/domain/service/AuthService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { LoginDto } from '../dto/LoginDto';

@Prefix('/api/v1/auth')
@Provider()
export class AuthController {
  @Inject(AuthService)
  private authService!: AuthService;

  @RequestMapping.Post('')
  async auth(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body() @RequestValidator(LoginDto) loginDTO: LoginDto): Promise<Record<string, string>> {
    const sessionData = await this.authService.auth(ctx, loginDTO as LoginDto);
    return {
      token: sessionData.token,
    };
  }
}
