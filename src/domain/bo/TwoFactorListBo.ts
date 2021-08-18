import { UserEntity } from '../model/UserEntity';

export class TwoFactorListBo {
  static createFromUser(userEntity: UserEntity): TwoFactorListBo {
    const twoFactorList = new TwoFactorListBo();
    twoFactorList.email = !!userEntity.emailAddr;
    twoFactorList.opt = !!userEntity.optKey;
    return twoFactorList;
  }

  static createFromJSON(json: Record<string, unknown>): TwoFactorListBo {
    const twoFactorList = new TwoFactorListBo();
    twoFactorList.email = !!json.email;
    twoFactorList.opt = !!json.opt;
    return twoFactorList;
  }

  email = false;
  opt = false;

  get hasTwoFactorAbility(): boolean {
    return this.email || this.opt;
  }
}
