import { AppConfigRepository } from './repository/AppConfigRepository';
import { AppDomainRepository } from './repository/AppDomainRepository';
import { AppRepository } from './repository/AppRepository';
import { AppServerProxyRepository } from './repository/ServerProxyRepository';
import { OperationLogRepository } from './repository/OperationLogRepository';
import { OrgRepository } from './repository/OrgRepository';
import { PageRepository } from './repository/PageRepository';
import { ResourceRepository } from './repository/ResourceRepository';
import { RolePermissionRepository } from './repository/RolePermissionRepository';
import { RoleRepository } from './repository/RoleRepository';
import { UserRepository } from './repository/UserRepository';
import { UniqueIdService } from './service/UniqueIdService';
import { AppThemeRepository } from './repository/AppThemeRepository';
import { PasswordService } from './service/PasswordService';
import { OneTimePasswordService } from './service/OneTimePasswordService';

export const Providers = [
  UniqueIdService,
  PasswordService,
  OneTimePasswordService,

  AppConfigRepository,
  AppDomainRepository,
  AppRepository,
  AppServerProxyRepository,
  AppThemeRepository,

  OperationLogRepository,
  OrgRepository,
  PageRepository,

  RolePermissionRepository,
  ResourceRepository,
  RoleRepository,
  UserRepository,
];
