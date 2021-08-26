import { UserEntity } from '../model/UserEntity';

interface TwoFactorListItemBo {
  type: string;
}

export class TwoFactorListBo extends Array<TwoFactorListItemBo> {
  static createFromUser(user: UserEntity): TwoFactorListBo {
    const twoFactorList = new TwoFactorListBo();
    const twoFactorAuth = user.twoFactorAuth;

    if (twoFactorAuth) {
      if (user.emailAddr) {
        twoFactorList.push({
          type: 'email',
        });
      }

      if (user.optKey) {
        twoFactorList.push({
          type: 'opt',
        });
      }
    }

    return twoFactorList;
  }
}
