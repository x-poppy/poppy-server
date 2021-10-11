import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { UserEntity, UserStatus } from '../model/UserEntity';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { AppEntity } from '../model/AppEntity';
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

  @Inject(RoleRepository)
  roleRepository!: RoleRepository;

  async list(opts: ListOpts): Promise<[UserEntity[], number]> {
    return this.userRepository.list(opts);
  }

  async findAndVerifyLoginUser(opts: FindAndVerifyLoginUserOpt): Promise<{
    app: AppEntity;
    user: UserEntity;
    userRole: RoleEntity;
  }> {
    const app = await this.appRepository.findByStatusNormal(opts.appNo);
    if (!app) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const user = await this.userRepository.findByAccountNameAndAppNo(opts.userName, opts.appNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${opts.userName} appNo: ${opts.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${opts.userName} appNo: ${app.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Is_Locked. userName: ${opts.userName} appNo: ${app.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    const userRole = await this.roleRepository.findByStatusNormal(user.roleNo);
    if (!userRole) {
      this.logger.warn(`Role_Is_Not_Exist. roleNo: ${user.roleNo}`);
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    return {
      app,
      user,
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
