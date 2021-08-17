import { UserEntity } from '../model/UserEntity';

export class TwoFactorListBo {
  static createFromUser(userEntity: UserEntity): TwoFactorListBo {
    const twoFactorList = new TwoFactorListBo();
    twoFactorList.email = userEntity.emailAddr;
    twoFactorList.optKey = userEntity.optKey;
    return twoFactorList;
  }

  email: string | null = null;
  optKey: string | null = null;

  get hasTwoFactorAbility(): boolean {
    return !!this.email || !!this.optKey;
  }
}
