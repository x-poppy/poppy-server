import { AppConfigRepository } from './repository/AppConfigRepository';
import { AppDomainRepository } from './repository/AppDomainRepository';
import { AppRepository } from './repository/AppRepository';
import { AppServerProxyRepository } from './repository/ServerProxyRepository';
import { OperationLogRepository } from './repository/OperationLogRepository';
import { PageRepository } from './repository/PageRepository';
import { MenuRepository } from './repository/MenuRepository';
import { RolePermissionRepository } from './repository/RolePermissionRepository';
import { RoleRepository } from './repository/RoleRepository';
import { UserRepository } from './repository/UserRepository';
import { UniqueIdService } from './service/UniqueIdService';
import { AppThemeRepository } from './repository/AppThemeRepository';
import { PasswordService } from './service/PasswordService';
import { OneTimePasswordService } from './service/OneTimePasswordService';
import { Module } from '@augejs/core';
import { MailService } from './service/MailService';
@Module({
  providers: [
    UniqueIdService,
    PasswordService,
    OneTimePasswordService,
    MailService,

    AppConfigRepository,
    AppDomainRepository,
    AppRepository,
    AppServerProxyRepository,
    AppThemeRepository,

    OperationLogRepository,
    PageRepository,

    RolePermissionRepository,
    MenuRepository,
    RoleRepository,
    UserRepository,
  ],
})
export class InfrastructureLayerModule {}
