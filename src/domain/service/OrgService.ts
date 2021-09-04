import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import randomPassword from 'secure-random-password';
import { getConnection } from '@augejs/typeorm';
import { OrgRepository } from '../../infrastructure/repository/OrgRepository';
import { BusinessError } from '../../util/BusinessError';
import { OrgEntity } from '../model/OrgEntity';

interface CreatOpts {
  appNo: string;
  orgDisplayName: string;
  orgDesc?: string | null;
  roleDisplayName: string;
  roleDesc?: string | null;
  userAccountName: string;
  userPassword?: string;
  userDisplayName?: string | null;
  userMobileNo?: string | null;
  userEmailAddr?: string | null;
}

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
  parent?: string | null;
}

@Provider()
export class OrgService {
  @GetLogger()
  logger!: ILogger;

  @Inject(OrgRepository)
  private orgRepository!: OrgRepository;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(RoleRepository)
  private roleRepository!: RoleRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  async create(opts: CreatOpts): Promise<OrgEntity> {
    this.logger.info(`create the org validate start: appNo ${opts.appNo}`);

    const app = await this.appRepository.findByStatusNormal(opts.appNo);
    if (!app) {
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const isTopOrg = !app.parent;
    const parentOrg = isTopOrg ? null : await this.orgRepository.findByStatusNormal(app.orgNo as string);
    if (!isTopOrg && !parentOrg) {
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const parentRole = await this.roleRepository.findByStatusNormal(app.roleNo);
    if (!parentRole) {
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    this.logger.info(`create the org validate end: appNo ${opts.appNo}`);
    this.logger.info(`create the org start: appNo: ${opts.appNo}`);

    // transaction
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // commit transaction now:
      // step 1 org
      this.logger.info(`create the org start steps: creat org entity start. appNo: ${opts.appNo}`);
      const createdOrg = await this.orgRepository.create(
        {
          parent: app.orgNo,
          appNo: app.appNo,
          level: parentOrg ? parentOrg.level + 1 : 0,
          displayName: opts.orgDisplayName,
          desc: opts.orgDesc ?? null,
        },
        queryRunner.manager,
      );
      this.logger.info(`create the org start steps: creat org entity end. appNo: ${opts.appNo}`);

      // step 2 org admin role
      this.logger.info(`create the org start steps: creat org user role entity start. appNo: ${opts.appNo} parent role: ${parentRole.roleNo}`);
      const createdRole = await this.roleRepository.create(
        {
          parent: parentRole.roleNo,
          level: parentRole.level + 1,
          orgNo: createdOrg.orgNo,
          appNo: app.appNo,
          displayName: `${opts.roleDisplayName}`,
          desc: opts.roleDesc ?? null,
          inherited: true,
        },
        queryRunner.manager,
      );
      this.logger.info(
        `create the org start steps: creat org user role entity end. appNo: ${opts.appNo} parent role: ${parentRole.roleNo} roleNo: ${createdRole.roleNo} roleLevel: ${createdRole.level}`,
      );

      // step 3 admin user
      this.logger.info(`create the org start steps: creat org user entity start. appNo: ${opts.appNo} roleNo: ${createdRole.roleNo}`);
      const userPassword =
        opts.userPassword ??
        randomPassword.randomPassword({
          length: 32,
          characters: [randomPassword.lower, randomPassword.digits, randomPassword.upper, randomPassword.symbols],
        });
      const createdUser = await this.userRepository.create(
        {
          orgNo: createdOrg.orgNo,
          appNo: app.appNo,
          roleNo: createdRole.roleNo,
          accountName: opts.userAccountName,
          password: userPassword,
          mobileNo: opts.userMobileNo ?? null,
          emailAddr: opts.userEmailAddr ?? null,
        },
        queryRunner.manager,
      );
      this.logger.info(`create the org start steps: creat org user entity end. appNo: ${opts.appNo} roleNo: ${createdRole.roleNo} userNo: ${createdUser.userNo}`);
      await queryRunner.commitTransaction();
      this.logger.info(`create the org: commitTransaction. appNo: ${app.appNo}`);

      return createdOrg;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(`create the org error: rollbackTransaction. appNo: ${app.appNo}`);
      throw err;
    }
  }

  async list(opts: ListOpts): Promise<[OrgEntity[], number]> {
    return this.orgRepository.list({
      offset: opts.offset,
      size: opts.size,
      appNo: opts.appNo,
      parent: opts.parent,
    });
  }

  // async delete() {
  // }
}
