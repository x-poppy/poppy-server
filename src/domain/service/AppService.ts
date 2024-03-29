import { getConnection } from '@augejs/typeorm';
import { GetLogger, ILogger, Inject, Provider, Value } from '@augejs/core';

import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { BusinessError } from '../../util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { AppEntity } from '../model/AppEntity';
import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { UniqueIdService } from '@/infrastructure/service/UniqueIdService';

interface CreateOpts {
  userNo: string;
  roleDisplayName: string;
  roleDesc?: string | null;
  appDisplayName: string;
  appDesc?: string | null;
  icon?: string | null;
}

interface ListOpts {
  offset: number;
  size: number;
  orgNo: string;
}

@Provider()
export class AppService {
  @Value('/webserver.port')
  serverPort!: string;

  @GetLogger()
  logger!: ILogger;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  @Inject(RoleRepository)
  private roleRepository!: RoleRepository;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  async create(opts: CreateOpts): Promise<AppEntity> {
    this.logger.info(`create the app validate start. userNo ${opts.userNo}`);

    const creatorUser = !opts.userNo ? null : await this.userRepository.findByStatusNormal(opts.userNo);
    if (!creatorUser) {
      this.logger.warn(`create the app error. userNo: ${opts.userNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    const creatorApp = creatorUser ? await this.appRepository.findByStatusNormal(creatorUser.appNo) : null;
    if (!creatorApp) {
      this.logger.warn(`create the app error. parent app: ${creatorUser?.appNo} is not exist!`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    let creatorRole = null;
    if (creatorUser) {
      creatorRole = await this.roleRepository.findByStatusNormal(creatorUser.roleNo);
      if (!creatorRole) {
        this.logger.warn(`create the app error. userNo: ${opts.userNo} target roleNo: ${creatorUser.roleNo} is not exist!`);
        throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
      }
    }

    this.logger.info(`create the app validate end. userNo: ${opts.userNo}`);

    this.logger.info(`create the app start. userNo: ${opts.userNo}`);

    // transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.logger.info(`create the app: startTransaction. userNo: ${opts.userNo}`);

    try {
      const createdAppNo = await this.uniqueIdService.getUniqueId();

      // step 1 app role
      const creatorRoleNo = creatorRole?.roleNo ?? null;
      this.logger.info(`create the app start steps: creat role entity start. userNo: ${opts.userNo} creatorRoleNo: ${creatorRoleNo}`);
      const createdRole = await this.roleRepository.create(
        {
          parent: creatorRoleNo,
          level: creatorRole ? creatorRole.level + 1 : 0,
          appNo: creatorUser?.appNo ?? createdAppNo,
          orgNo: creatorUser?.orgNo ?? null,
          displayName: opts.roleDisplayName,
          desc: opts.roleDesc ?? null,
          inherited: true,
          hasAppResPerms: true,
        },
        queryRunner.manager,
      );
      this.logger.info(
        `create the app start steps: creat role entity end. userNo: ${opts.userNo} creatorRoleNo: ${creatorRoleNo} roleNo: ${createdRole.roleNo} roleLevel: ${createdRole.level}`,
      );

      // step 2 app
      this.logger.info(`create the app start steps: creat app entity start. userNo: ${opts.userNo}`);
      const createdApp = await this.appRepository.create(
        {
          appNo: createdAppNo,
          orgNo: creatorUser?.orgNo ?? null,
          roleNo: createdRole.roleNo,
          parent: creatorApp?.appNo ?? null,
          level: creatorApp ? creatorApp.level + 1 : 0,
          icon: opts.icon ?? null,
          displayName: opts.appDisplayName,
          desc: opts.appDesc ?? null,
        },
        queryRunner.manager,
      );
      this.logger.info(`create the app start steps: creat app entity end. appNo: ${createdApp.appNo}`);

      await queryRunner.commitTransaction();
      this.logger.info(`create the app: commitTransaction. userNo: ${opts.userNo}`);
      return createdApp;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(`create the app error: rollbackTransaction. userNo: ${opts.userNo}`);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async list(opts: ListOpts): Promise<[AppEntity[], number]> {
    return this.appRepository.list({
      offset: opts.offset,
      size: opts.size,
      orgNo: opts.orgNo,
    });
  }

  async delete(appNo: string): Promise<void> {
    return this.appRepository.delete({
      appNo,
    });
  }
}
