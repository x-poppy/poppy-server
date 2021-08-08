import { AppConfigRepository } from './repository/AppConfigRepository';
import { AppDomainRepository } from './repository/AppDomainRepository';
import { AppRepository } from './repository/AppRepository';
import { AppServerProxyRepository } from './repository/AppServerProxyRepository';
import { OperationLogRepository } from './repository/OperationLogRepository';
import { OrgRepository } from './repository/OrgRepository';
import { PageRepository } from './repository/PageRepository';
import { ResourceRepository } from './repository/ResourceRepository';
import { RolePermissionRepository } from './repository/RolePermissionRepository';
import { RoleRepository } from './repository/RoleRepository';
import { UserRepository } from './repository/UserRepository';
import { UniqueIdService } from './service/UniqueIdService';

export const Providers = [
  AppConfigRepository,
  AppDomainRepository,
  AppRepository,
  AppServerProxyRepository,
  OperationLogRepository,
  OrgRepository,
  RoleRepository,
  RolePermissionRepository,
  PageRepository,
  ResourceRepository,
  UserRepository,
  UniqueIdService,
];
