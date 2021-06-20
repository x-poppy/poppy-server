import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessTokenMiddleware } from '@augejs/koa-access-token';

import { LoginDto } from '../dto/LoginDto';
import { SessionService } from '../../domain/service/SessionService';

@Provider()
export class SessionController {
  @Inject(SessionService)
  private sessionService!: SessionService;

  @RequestMapping.Post('/api/v1/session')
  async create(
    @RequestParams.Context() context: KoaContext,
    @RequestParams.Body() @RequestParams.TransformAndValidate(LoginDto) loginDTO: LoginDto
    ): Promise<Record<string, unknown>> {
    const accessData = await this.sessionService.createAccessData(context, loginDTO);
    context.accessData = accessData;
    await accessData.save();

    return accessData.toJSON();
  }

  @AccessTokenMiddleware()
  @RequestMapping.Delete('/api/v1/session')
  async delete(@RequestParams.Context() context: KoaContext): Promise<void> {
    context.accessData = null;
  }

  @AccessTokenMiddleware()
  @RequestMapping.Get('/api/v1/session')
  async show(@RequestParams.Context() context: KoaContext): Promise<Record<string, unknown>> {
    return context.accessData!.toJSON();
  }
}
