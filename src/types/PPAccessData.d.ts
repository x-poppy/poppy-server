import { AccessData } from '@augejs/koa-access-token';

export type PPAccessDataReadyOnlyKeyType = 'userId' | 'accountName' | 'userRoleId' | 'userRoleLevel' | 'appId' | 'appLevel';

interface PPAccessData extends AccessData {
  get<T = string>(key: PPAccessDataReadyOnlyKeyType): T;
}
