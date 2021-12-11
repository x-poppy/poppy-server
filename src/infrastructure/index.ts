import { AppConfigRepository } from './repository/AppConfigRepository';
import { AppDomainRepository } from './repository/AppDomainRepository';
import { AppRepository } from './repository/AppRepository';
import { OperationLogRepository } from './repository/OperationLogRepository';
import { PageRepository } from './repository/PageRepository';
import { MenuRepository } from './repository/MenuRepository';
import { RolePermissionRepository } from './repository/RolePermissionRepository';
import { RoleRepository } from './repository/RoleRepository';
import { UserRepository } from './repository/UserRepository';
import { UniqueIdService } from './service/UniqueIdService';
import { ThemeRepository } from './repository/ThemeRepository';
import { PasswordService } from './service/PasswordService';
import { OneTimePasswordService } from './service/OneTimePasswordService';
import { Module } from '@augejs/core';
import { MailService } from './service/MailService';
import { I18nRepository } from './repository/I18nRepository';
import { CacheService } from './service/CacheService';
import { RandomService } from './service/RandomService';
import { AppLangRepository } from './repository/AppLangRepository';
import { UserCredentialRepository } from './repository/UserCredentialRepository';
import { CustomizedServiceRepository } from './repository/CustomizedServiceRepository';

@Module({
  providers: [
    UniqueIdService,
    PasswordService,
    OneTimePasswordService,
    MailService,
    CacheService,
    RandomService,

    AppConfigRepository,
    AppDomainRepository,
    AppRepository,
    ThemeRepository,

    OperationLogRepository,
    PageRepository,
    RolePermissionRepository,
    MenuRepository,
    RoleRepository,
    UserRepository,
    UserCredentialRepository,
    I18nRepository,
    AppLangRepository,
    CustomizedServiceRepository,
  ],
})
export class InfrastructureLayerModule {}
