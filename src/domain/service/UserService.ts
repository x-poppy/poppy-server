import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { UserDO, UserStatus } from '../model/UserDO';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
import { PPService } from './PPService';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { EntityManager, Transaction, TransactionManager } from '@augejs/typeorm';
import { UserCreateDTO } from '@/facade/dto/UserDTO';
import { UserCredentialRepository } from '@/infrastructure/repository/UserCredentialRepository';
import { RoleDO } from '../model/RoleDO';
import { AppDO } from '../model/AppDO';
import { AppCreateDTO } from '@/facade/dto/AppDTO';
@Provider()
export class UserService extends PPService<UserDO, UserRepository> {

  @GetLogger()
  private readonly logger!: ILogger;

  @Inject(UserRepository)
  protected override readonly repository!: UserRepository;

  @Inject(UserCredentialRepository)
  private userCredentialRepository!: UserCredentialRepository;

  async findAndVerify(appId: string, accountName: string): Promise<UserDO> | never {
    const user = await this.repository.findOne({ appId, accountName }, { select: ['id', 'roleId', 'status']});
    if (!user) {
      this.logger.info(`User_Is_Not_Exist. appId: ${appId} accountName: ${accountName}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`App_Status_Is_Disabled. appId: ${appId} accountName: ${accountName}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Status_Is_Locked. appId: ${appId} accountName: ${accountName}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Locked);
    }

    if (user.status !== UserStatus.NORMAL) {
      this.logger.warn(`User_Status_Is_Not_Normal. appId: ${appId} accountName: ${accountName}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Not_Normal);
    }

    return user;
  }

  async checkAccountNameAvailable(appId: string, accountName: string): Promise<boolean> {
    const user = await this.repository.findOne({ appId, accountName }, { select: ['id']});
    return !user;
  }

  @Transaction()
  async createUser (dto: UserCreateDTO, @TransactionManager() manager?: EntityManager): Promise<UserDO> {
    const user: UserDO = await this.repository.create({
      accountName: dto.emailAddr,
      emailAddr: dto.emailAddr,
      headerImg: dto.headerImg,
      appId: dto.appId,
      roleId: dto.roleId,
    }, manager);

    await this.userCredentialRepository.create({
      userId: user.id,
      appId: dto.appId,
    }, manager);

    // send email

    return user;
  }

  async createUserByAppDto(dto: AppCreateDTO,
    createdApp: AppDO, createdRole: RoleDO,
    manager: EntityManager): Promise<UserDO> {
      const user = await this.repository.create({
        accountName: dto.emailAddr,
        emailAddr: dto.emailAddr,
        appLevel: createdApp.level,
        appId: createdApp.id,
        roleId:createdRole.id,
      }, manager);

      await this.userCredentialRepository.create({
        userId: user.id,
      }, manager);

      return user;
  }

  @Transaction()
  async deleteUser(userId: string, appId: string, @TransactionManager() manager: EntityManager): Promise<void> {
    await this.repository.delete({id: userId, appId,}, manager);
    await this.userCredentialRepository.delete({ userId, appId }, manager);
  }
}
