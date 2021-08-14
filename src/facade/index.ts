import { SessionAuthController } from './rest/SessionAuthController';
import { HeadIconController } from './rest/HeadIconController';
import { MenuController } from './rest/MenuController';
import { OrgController } from './rest/OrgController';
import { PageController } from './rest/PageController';
import { SessionController } from './rest/SessionController';
import { UserController } from './rest/UserController';
import { AppDomainController } from './rest/AppDomainController';

export const Providers = [SessionAuthController, OrgController, PageController, SessionController, UserController, MenuController, HeadIconController, AppDomainController];
