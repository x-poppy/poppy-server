import { AppConfigService } from './service/AppConfigService';
import { AppDomainService } from './service/AppDomainService';
import { AppService } from './service/AppService';
import { OperationLogService } from './service/OperationLogService';
import { OrgService } from './service/OrgService';
import { PageService } from './service/PageService';
import { SessionService } from './service/SessionService';
import { UserService } from './service/UserService';
import { AppServerWebHookService } from './service/ServerWebHookService';
import { AppServerProxyService } from './service/ServerProxyService';
import { RolePermissionService } from './service/RolePermissionService';
import { MenuService } from './service/MenuService';
import { AppThemeService } from './service/AppThemeService';
import { AppUIService } from './service/AppUIService';
import { TwoFactorService } from './service/TwoFactorService';
import { RoleService } from './service/RoleService';
import { ForgetPasswordService } from './service/ForgetPasswordService';
import { Module } from '@augejs/core';
import { ResetPasswordInviteService } from './service/ResetPasswordInviteService';
import { ChangePasswordService } from './service/ChangePasswordService';
import { ResetPasswordService } from './service/ResetPasswordService';
import { UserNoticeService } from './service/UserNoticeService';

@Module({
  providers: [
    AppConfigService,
    AppDomainService,
    AppServerProxyService,
    AppServerWebHookService,
    AppService,
    AppThemeService,
    AppUIService,

    ForgetPasswordService,
    ResetPasswordInviteService,
    ChangePasswordService,
    ResetPasswordService,

    UserNoticeService,

    MenuService,

    OperationLogService,
    OrgService,
    PageService,

    RolePermissionService,
    RoleService,
    SessionService,
    TwoFactorService,
    UserService,
  ],
})
export class DomainLayerModule {}
