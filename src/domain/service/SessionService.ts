import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { AccessData } from '@augejs/koa-access-token/dist/AccessData';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';

import { I18nMessageKeys } from '@/util/I18nMessageKeys';

import { AppConfigKeys } from '@/util/AppConfigKeys';

import { AppConfigService } from './AppConfigService';
import { RolePermissionService } from './RolePermissionService';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';
import { BusinessError, ClientValidationError } from '@/util/BusinessError';
import { UserStatus } from '../model/UserEntity';
import { LoginDto } from '@/facade/dto/LoginDto';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';

@Provider()
export class SessionService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(AppConfigService)
  private appConfigService!: AppConfigService;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(RolePermissionService)
  rolePermissionService!: RolePermissionService;

  @Inject(RoleRepository)
  roleRepository!: RoleRepository;

  @Inject(OrgRepository)
  orgRepository!: OrgRepository;

  async auth(ctx: KoaContext, loginDto: LoginDto): Promise<StepData> {
    this.logger.info(`auth start. userName ${loginDto.userName} appNo: ${loginDto.appNo}`);

    const app = await this.appRepository.findByStatusNormal(loginDto.appNo);
    if (!app) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${loginDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const isTopApp = !app.parent;
    const appOrg = isTopApp ? null : await this.orgRepository.findByStatusNormal(app.orgNo as string);
    if (!isTopApp && !appOrg) {
      this.logger.warn(`App_Is_Not_Exist. appOrgNo: ${app.orgNo}`);
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const user = await this.userRepository.findByAccountNameAndAppNo(loginDto.userName, loginDto.appNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${loginDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${loginDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Is_Locked. userName: ${loginDto.userName} appNo: ${loginDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    const userOrg = await this.orgRepository.findByStatusNormal(user.orgNo);
    if (!userOrg) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${loginDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const userRole = await this.roleRepository.findByStatusNormal(user.roleNo);
    if (!userRole) {
      this.logger.warn(`Role_Is_Not_Exist. roleNo: ${user.roleNo}`);
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    const verifyPwdResult = await this.passwordService.verify(user.userNo, user.nonce, loginDto.password, user.passwd);
    if (!verifyPwdResult) {
      // here is punish mechanism here for test the passwd.

      this.logger.warn(`User_Name_Or_Password_Is_InCorrect. userName: ${loginDto.userName}`);
      throw new ClientValidationError(I18nMessageKeys.User_Name_Or_Password_Is_InCorrect);
    }

    const twoFactorList = TwoFactorListBo.createFromUser(user);

    const stepData = ctx.createStepData('login');
    stepData.set('userNo', user.userNo);
    stepData.set('accountName', user.accountName);
    stepData.set('userHeaderImg', user.headerImg);

    stepData.set('userOrgNo', userOrg.orgNo);
    stepData.set('userOrgLevel', userOrg.level);

    stepData.set('userRoleNo', userRole.roleNo);
    stepData.set('userRoleLevel', userRole.level);

    stepData.set('appNo', app.appNo);
    stepData.set('appOrgNo', app.orgNo);
    stepData.set('appLevel', app.level);

    stepData.set('twoFactorAuth', twoFactorList.length > 0);

    const twoFactorAuthSteps = [];
    if (twoFactorList.length > 0) {
      stepData.set('twoFactorAuthList', twoFactorList);
      twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    }
    stepData.steps = [...twoFactorAuthSteps, 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    this.logger.info(`auth end. userName ${loginDto.userName} domain: ${loginDto.appNo}`);

    return stepData;
  }

  private async kickOffOnlineUsers(context: KoaContext, userNo: string, userAppNo: string): Promise<void> {
    const maxOnlineUserCount = await this.appConfigService.getMaxOnlineUserCount(userAppNo);

    const accessDataList = await context.findAccessDataListByUserId(userNo, {
      skipCount: maxOnlineUserCount - 1,
    });

    // after verify the pwd then kick the before session.
    for (const accessData of accessDataList) {
      accessData.isDeadNextTime = true;
      accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Kick_Before_User_After_New_Login }, { ip: context.ip });
      accessData.commit();
      await accessData.save();
    }
  }

  async createAccessData(ctx: KoaContext): Promise<AccessData> | never {
    const stepData = ctx.stepData as StepData;

    const userNo = stepData.get<string>('userNo');
    const userOrgNo = stepData.get<string>('userRoleNo');
    const userAppNo = stepData.get<string>('appNo');

    this.logger.info(`createAccessData start. userNo: ${userNo}`);

    const userPermissions = await this.rolePermissionService.findPermissionsByRoleNo(userOrgNo);

    await this.kickOffOnlineUsers(ctx, userNo, userAppNo);

    const accessData = ctx.createAccessData(userNo, process.env.NODE_ENV !== 'production' ? '2h' : undefined);

    accessData.set('userNo', stepData.get('userNo'));
    accessData.set('userDisplayName', stepData.get('userDisplayName'));
    accessData.set('userHeaderImg', stepData.get('userHeaderImg'));

    accessData.set('userOrgNo', stepData.get('userOrgNo'));
    accessData.set('userOrgLevel', stepData.get('userOrgLevel'));

    accessData.set('userRoleNo', stepData.get('userRoleNo'));
    accessData.set('userRoleLevel', stepData.get('userRoleLevel'));

    accessData.set('appNo', stepData.get('appNo'));
    accessData.set('appOrgNo', stepData.get('appOrgNo'));
    accessData.set('appLevel', stepData.get('appLevel'));

    accessData.set('userPermissions', userPermissions.toJson());

    await accessData.save();

    this.logger.info(`createAccessData end. userNo: ${userNo}`);

    return accessData;
  }
}
