import { AccessData } from '@augejs/koa-access-token';

type PoppyAccessDataReadyOnlyKeyType = 'userNo' | 'accountName' | 'userRoleNo' | 'userRoleLevel' | 'appNo' | 'appLevel' | 'userPermissions';

interface PoppyAccessData extends AccessData {
  get<T = string>(key: PoppyAccessDataReadyOnlyKeyType): T;
}
