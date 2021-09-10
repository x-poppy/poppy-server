import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { UserEntity, UserStatus } from '../model/UserEntity';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { AppEntity } from '../model/AppEntity';
import { OrgEntity } from '../model/OrgEntity';
import { RoleEntity } from '../model/RoleEntity';

interface ListOpts {
  appNo: string;
  offset: number;
  size: number;
}

interface FindAndVerifyLoginUserOpt {
  userName: string;
  appNo: string;
}

@Provider()
export class UserService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(OrgRepository)
  orgRepository!: OrgRepository;

  @Inject(RoleRepository)
  roleRepository!: RoleRepository;

  async list(opts: ListOpts): Promise<[UserEntity[], number]> {
    return this.userRepository.list(opts);
  }

  async findAndVerifyLoginUser(opts: FindAndVerifyLoginUserOpt): Promise<{
    app: AppEntity;
    user: UserEntity;
    userOrg: OrgEntity;
    userRole: RoleEntity;
  }> {
    const app = await this.appRepository.findByStatusNormal(opts.appNo);
    if (!app) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const isTopApp = !app.parent;
    const appOrg = isTopApp ? null : await this.orgRepository.findByStatusNormal(app.orgNo as string);
    if (!isTopApp && !appOrg) {
      this.logger.warn(`Org_Is_Not_Exist. appOrgNo: ${app.orgNo}`);
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const user = await this.userRepository.findByAccountNameAndAppNo(opts.userName, opts.appNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${opts.userName} appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${opts.userName} appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Is_Locked. userName: ${opts.userName} appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    const userOrg = await this.orgRepository.findByStatusNormal(user.orgNo);
    if (!userOrg) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${opts.userName} appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const userRole = await this.roleRepository.findByStatusNormal(user.roleNo);
    if (!userRole) {
      this.logger.warn(`Role_Is_Not_Exist. roleNo: ${user.roleNo}`);
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    return {
      app,
      user,
      userOrg,
      userRole,
    };
  }

  async updatePassword(userNo: string, hashPassword: string): Promise<void> {
    const user = await this.userRepository.find(userNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    this.userRepository.updateUserPassword(userNo, hashPassword);
  }
}
