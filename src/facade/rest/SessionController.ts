import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { SessionService } from '../../domain/service/SessionService';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaSessionTokenMiddleware } from '@augejs/koa-session-token';

@Prefix('/api/v1/session')
@Provider()
export class SessionController {
  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(SessionService)
  private sessionService!: SessionService;

  @RequestMapping.Post('')
  @KoaSessionTokenMiddleware('login')
  async create(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    const accessData = await this.sessionService.createAccessData(ctx);
    ctx.sessionData = null;
    return accessData.toJSON();
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('')
  async delete(@RequestParams.Context() ctx: KoaContext): Promise<void> {
    ctx.accessData = null;
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async show(@RequestParams.Context() ctx: KoaContext): Promise<Record<string, unknown>> {
    return ctx.accessData!.toJSON();
  }
}
