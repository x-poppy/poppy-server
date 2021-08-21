import { HeadMenuController } from './rest/HeadMenuController';
import { HomeMenuController } from './rest/HomeMenuController';
import { OrgController } from './rest/OrgController';
import { PageController } from './rest/PageController';
import { SessionController } from './rest/SessionController';
import { UserController } from './rest/UserController';
import { AppUIController } from './rest/AppUIController';
import { TwoFactorController } from './rest/TwoFactorController';

export const Providers = [OrgController, PageController, SessionController, UserController, HomeMenuController, HeadMenuController, AppUIController, TwoFactorController];
