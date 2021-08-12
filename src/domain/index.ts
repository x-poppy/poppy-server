import { AppConfigService } from './service/AppConfigService';
import { AppDomainService } from './service/AppDomainService';
import { AppService } from './service/AppService';
import { PasswordService } from '../infrastructure/service/PasswordService';
import { OperationLogService } from './service/OperationLogService';
import { OrgService } from './service/OrgService';
import { PageService } from './service/PageService';
import { AppResourceService } from './service/ResourceService';
import { SessionService } from './service/SessionService';
import { UserService } from './service/UserService';
import { AppServerWebHookService } from './service/ServerWebHookService';
import { AppServerProxyService } from './service/ServerProxyService';
import { RolePermissionService } from './service/RolePermissionService';
import { SessionAuthService } from './service/SessionAuthService';
import { MenuService } from './service/MenuService';
import { HeadIconService } from './service/HeadIconService';

export const Providers = [
  AppConfigService,
  AppDomainService,
  AppServerProxyService,
  AppServerWebHookService,
  AppService,
  PasswordService,
  OperationLogService,
  OrgService,
  PageService,
  AppResourceService,
  RolePermissionService,
  SessionService,
  UserService,
  SessionAuthService,
  MenuService,
  HeadIconService,
];
