import { AppConfigService } from './service/AppConfigService';
import { AppDomainService } from './service/AppDomainService';
import { AppService } from './service/AppService';
import { OperationLogService } from './service/OperationLogService';
import { PageService } from './service/PageService';
import { SessionService } from './service/SessionService';
import { UserService } from './service/UserService';
import { RolePermissionService } from './service/RolePermissionService';
import { MenuService } from './service/MenuService';
import { ThemeService } from './service/ThemeService';
import { TwoFactorAuthService } from './service/TwoFactorAuthService';
import { RoleService } from './service/RoleService';
import { ForgetPasswordService } from './service/ForgetPasswordService';
import { Module } from '@augejs/core';
import { ResetPasswordInviteService } from './service/ResetPasswordInviteService';
import { ChangePasswordService } from './service/ChangePasswordService';
import { ResetPasswordService } from './service/ResetPasswordService';
import { I18nService } from './service/I18nService';
import { AppLangService } from './service/AppLangService';
import { UserCredentialService } from './service/UserCredentialService';
import { CustomizedServiceService } from './service/CustomizedServiceService';
import { CustomizedServiceAdapterModule } from './service/customizedServiceAdapter';

@Module({
  providers: [
    AppConfigService,
    AppDomainService,
    I18nService,
    ThemeService,
    UserService,
    UserCredentialService,
    AppService,
    MenuService,

    CustomizedServiceService,

    RolePermissionService,
    RoleService,
    SessionService,
    AppLangService,
    TwoFactorAuthService,
    OperationLogService,
  ],
  subModules: [
    CustomizedServiceAdapterModule,
  ]
})
export class DomainLayerModule {}
