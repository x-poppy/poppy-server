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
import { RestPasswordController } from './rest/RestPasswordController';
import { SecurityCenterController } from './rest/SecurityCenterController';
import { OperationLogController } from './rest/OperationLogController';
import { ResourceController } from './rest/ResourceController';
import { ServerHookController } from './rest/ServerHookController';

export const Providers = [
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
  RestPasswordController,
  SecurityCenterController,
  SessionController,
  TwoFactorController,
  UserController,
  RoleController,
];
