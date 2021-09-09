import { HeadMenuController } from './rest/HeadMenuController';
import { HomeMenuController } from './rest/HomeMenuController';
import { OrgController } from './rest/OrgController';
import { PageController } from './rest/PageController';
import { SessionController } from './rest/SessionController';
import { UserController } from './rest/UserController';
import { AppUIController } from './rest/AppUIController';
import { TwoFactorController } from './rest/TwoFactorController';
import { RoleController } from './rest/RoleController';
import { AppController } from './rest/AppController';
import { AppConfigController } from './rest/AppConfigController';
import { AppDomainController } from './rest/AppDomainController';
import { AppThemeController } from './rest/AppThemeController';
import { ForgetPasswordController } from './rest/ForgetPasswordController';
import { ServerProxyController } from './rest/ServerProxyController';
import { RestPasswordInviteController } from './rest/RestPasswordInviteController';
import { OperationLogController } from './rest/OperationLogController';
import { ResourceController } from './rest/ResourceController';
import { ServerHookController } from './rest/ServerHookController';
import { Inject, Module } from '@augejs/core';
import { KoaContext, MiddlewareHandler } from '@augejs/koa';
import { RestfulAPIHandlerService } from '@/application/service/RestfulAPIHandlerService';
import { KoaBodyParserMiddleware } from '@augejs/koa-bodyparser';
import { HomeController } from './web/HomeController';
import { ChangePasswordController } from './rest/ChangePasswordController';
@Module({
  providers: [
    AppController,
    AppConfigController,
    AppDomainController,
    AppThemeController,
    AppUIController,
    ForgetPasswordController,
    HomeMenuController,
    HeadMenuController,
    OrgController,
    OperationLogController,
    PageController,
    ServerHookController,
    ServerProxyController,
    ResourceController,
    RestPasswordInviteController,
    ChangePasswordController,
    SessionController,
    TwoFactorController,
    UserController,
    RoleController,
    HomeController,
  ],
})
@KoaBodyParserMiddleware()
export class FacadeLayerModule {
  @Inject(RestfulAPIHandlerService)
  restfulAPIHandlerService!: RestfulAPIHandlerService;

  @MiddlewareHandler()
  async globalHandler(ctx: KoaContext, next: CallableFunction): Promise<void> {
    await this.restfulAPIHandlerService.globalHandler(ctx, next);
  }
}
