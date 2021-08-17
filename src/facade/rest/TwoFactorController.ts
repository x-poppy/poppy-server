import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaSessionTokenMiddleware } from '@augejs/koa-session-token';

import { TwoFactorListBo } from '@/domain/bo/TwoFactorListBo';
import { TwoFactorService } from '@/domain/service/TwoFactorService';
import { ClientValidationError } from '@/util/BusinessError';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';

import { TwoFactorAuthDto } from '../dto/TwoFactorAuthDto';

@Prefix('/api/v1/authorization/two-factor')
@Provider()
export class TwoFactorController {
  @Inject(TwoFactorService)
  twoFactorService!: TwoFactorService;

  @RequestMapping.Get('')
  list(@RequestParams.Query('userNo') userNo: string): Promise<TwoFactorListBo> {
    if (!userNo) {
      throw new ClientValidationError(I18nMessageKeys.User_No_Empty_Error);
    }

    return this.twoFactorService.list(userNo);
  }

  @KoaSessionTokenMiddleware(['login'])
  @RequestMapping.Post('')
  async auth(@RequestParams.Context() ctx: KoaContext, @RequestValidator(TwoFactorAuthDto) twoFactorAuthDto: TwoFactorAuthDto): Promise<Record<string, string>> {
    const sessionData = await this.twoFactorService.auth(ctx, twoFactorAuthDto);

    // remove the last
    ctx.sessionData = null;

    return {
      token: sessionData.token,
    };
  }
}
