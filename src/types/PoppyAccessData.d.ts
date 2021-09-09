import { AccessData } from '@augejs/koa-access-token';

type PoppyAccessDataReadyOnlyKeyType =
  | 'userNo'
  | 'accountName'
  | 'userHeaderImg'
  | 'userOrgNo'
  | 'userOrgLevel'
  | 'userRoleNo'
  | 'userRoleLevel'
  | 'appNo'
  | 'appOrgNo'
  | 'appLevel'
  | 'userPermissions';

interface PoppyAccessData extends AccessData {
  get<T = string>(key: PoppyAccessDataReadyOnlyKeyType): T;
}
