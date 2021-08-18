import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';

import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { LoginDto } from '@/facade/dto/LoginDto';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';

import { UserStatus } from '../model/UserEntity';
import { BusinessError, ClientValidationError } from '../../util/BusinessError';

import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';

import { RolePermissionService } from './RolePermissionService';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';

@Provider()
export class SessionAuthService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

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
    const twoFactorAuth = user.twoFactorAuth && twoFactorList.hasTwoFactorAbility;

    const stepData = ctx.createStepData('login');
    stepData.set('userNo', user.userNo);
    stepData.set('userRoleNo', userRole.roleNo);
    stepData.set('userOrgNo', user.orgNo);
    stepData.set('appNo', app.appNo);
    stepData.set('appOrgNo', app.orgNo);
    stepData.set('twoFactorAuth', twoFactorAuth);

    const twoFactorAuthSteps = [];
    if (twoFactorAuth) {
      stepData.set('twoFactorAuthList', {
        email: twoFactorList.email,
        opt: twoFactorList.opt,
      });
      twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    }

    stepData.steps = [...twoFactorAuthSteps, 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    this.logger.info(`auth end. userName ${loginDto.userName} domain: ${loginDto.appNo}`);

    return stepData;
  }
}
