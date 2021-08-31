import { AppConfigService } from './service/AppConfigService';
import { AppDomainService } from './service/AppDomainService';
import { AppService } from './service/AppService';
import { OperationLogService } from './service/OperationLogService';
import { OrgService } from './service/OrgService';
import { PageService } from './service/PageService';
import { AppResourceService } from './service/ResourceService';
import { SessionService } from './service/SessionService';
import { UserService } from './service/UserService';
import { AppServerWebHookService } from './service/ServerWebHookService';
import { AppServerProxyService } from './service/ServerProxyService';
import { RolePermissionService } from './service/RolePermissionService';
import { HomeMenuService } from './service/HomeMenuService';
import { HeadMenuService } from './service/HeadMenuService';
import { AppThemeService } from './service/AppThemeService';
import { AppUIService } from './service/AppUIService';
import { TwoFactorService } from './service/TwoFactorService';
import { RoleService } from './service/RoleService';
import { ForgetPasswordService } from './service/ForgetPasswordService';
import { Module } from '@augejs/core';

@Module({
  providers: [
    AppConfigService,
    AppDomainService,
    AppResourceService,
    AppServerProxyService,
    AppServerWebHookService,
    AppService,
    AppThemeService,
    AppUIService,
    ForgetPasswordService,

    HomeMenuService,
    HeadMenuService,

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
