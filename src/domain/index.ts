import { AppConfigService } from './service/AppConfigService';
import { AppDomainService } from './service/AppDomainService';
import { AppService } from './service/AppService';
import { PasswordService } from '../infrastructure/service/PasswordService';
import { OperationLogService } from './service/OperationLogService';
import { OrgService } from './service/OrgService';
import { PageService } from './service/PageService';
import { ResourceService } from './service/ResourceService';
import { SessionService } from './service/SessionService';
import { UserService } from './service/UserService';
import { AppServerWebHookService } from './service/AppServerWebHookService';
import { AppServerProxyService } from './service/AppServerProxyService';
import { RolePermissionService } from './service/RolePermissionService';

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
  ResourceService,
  RolePermissionService,
  SessionService,
  UserService,
];
