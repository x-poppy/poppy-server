import { AuthController } from './rest/AuthController';
import { HeadIconController } from './rest/HeadIconController';
import { MenuController } from './rest/MenuController';
import { OrgController } from './rest/OrgController';
import { PageController } from './rest/PageController';
import { SessionController } from './rest/SessionController';
import { UserController } from './rest/UserController';

export const Providers = [AuthController, OrgController, PageController, SessionController, UserController, MenuController, HeadIconController];
