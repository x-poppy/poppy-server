import { MenuController } from './rest/MenuController';
import { PageController } from './rest/PageController';
import { SessionController } from './rest/SessionController';
import { UserController } from './rest/UserController';
import { TwoFactorAuthController } from './rest/TwoFactorAuthController';
import { RoleController } from './rest/RoleController';
import { AppController } from './rest/AppController';
import { AppConfigController } from './rest/AppConfigController';
import { AppDomainController } from './rest/AppDomainController';
import { ThemeController } from './rest/ThemeController';
import { ForgetPasswordController } from './rest/ForgetPasswordController';
import { RestPasswordInviteController } from './rest/RestPasswordInviteController';
import { OperationLogController } from './rest/OperationLogController';
import { Inject, Module } from '@augejs/core';
import { KoaContext, MiddlewareHandler } from '@augejs/koa';
import { RestfulAPIHandlerService } from '@/application/service/RestfulAPIHandlerService';
import { KoaBodyParserMiddleware } from '@augejs/koa-bodyparser';
import { HomeController } from './web/HomeController';
import { I18nController } from './rest/I18nController';
import { AppLangController } from './rest/AppLangController';
import { SwaggerSecurityDefinition } from '@augejs/koa-swagger';
import { AvatarController } from './rest/AvatarController';
import { CustomizedServiceController } from './rest/CustomizedServiceController';

@SwaggerSecurityDefinition('accessToken', {
  name: 'Authorization',
  type: 'apiKey',
  in: 'header'
})
@Module({
  providers: [
    HomeController,
    SessionController,
    // AppConfigController,
    AppDomainController,
    AppLangController,
    RoleController,
    UserController,
    I18nController,
    AppController,
    MenuController,
    TwoFactorAuthController,
    AvatarController,
    CustomizedServiceController
  ],
})
@KoaBodyParserMiddleware()
export class AdminFacadeLayerModule {
  @Inject(RestfulAPIHandlerService)
  restfulAPIHandlerService!: RestfulAPIHandlerService;

  @MiddlewareHandler()
  async globalHandler(ctx: KoaContext, next: CallableFunction): Promise<void> {
    await this.restfulAPIHandlerService.globalHandler(ctx, next);
  }
}
