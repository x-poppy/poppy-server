import path from 'path';
import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PoppyAccessData } from '@/types/PoppyAccessData';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';
import { AppConfigService } from './AppConfigService';
import { ChangePasswordDto } from '@/facade/dto/ChangePasswordDto';
import { RestPasswordInviteDto } from '@/facade/dto/RestPasswordInviteDto';

@Provider()
export class ResetPasswordInviteService {
  @GetLogger()
  private logger!: ILogger;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  @Inject(AppDomainRepository)
  private appDomainRepository!: AppDomainRepository;

  @Inject(AppConfigService)
  appConfigService!: AppConfigService;

  async auth(ctx: KoaContext, restPasswordInviteDto: RestPasswordInviteDto): Promise<StepData> {
    const accessData = ctx.accessData as PoppyAccessData;
    const userNo = accessData.get('userNo');

    const user = await this.userRepository.find(userNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    const userApp = await this.appRepository.findByStatusNormal(user.appNo);
    if (!userApp) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${user.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const targetUser = await this.userRepository.find(restPasswordInviteDto.userNo);
    if (!targetUser) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${restPasswordInviteDto.userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    const targetUserApp = await this.appRepository.findByStatusNormal(targetUser.appNo);
    if (!targetUserApp) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${targetUser.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const targetUserAppDomainAddress = await this.appDomainRepository.findAppDomainAddressByAppNo(targetUserApp.appNo);
    if (!targetUserAppDomainAddress) {
      this.logger.info(`Domain_Is_Not_Exist. appNo: ${targetUser.appNo}`);
      throw new BusinessError(I18nMessageKeys.Domain_Is_Not_Exist);
    }

    const passwordLinkExpireTime = await this.appConfigService.getResetPasswordLinkExpireTime(targetUserApp.appNo);

    const stepData = ctx.createStepData('resetPasswordInvite');

    stepData.set('userNo', user.userNo);
    stepData.set('userAccountName', user.accountName);
    stepData.set('userAppName', userApp.displayName);

    stepData.set('targetUserAccountName', targetUser.accountName);
    stepData.set('targetUserAppNo', targetUserApp.appNo);

    stepData.set('targetUserEmail', targetUser.emailAddr);
    stepData.set('targetUserAppDomainAddress', targetUserAppDomainAddress);
    stepData.set('targetUserPasswordLinkExpireTime', passwordLinkExpireTime);

    const twoFactorList = TwoFactorListBo.createFromUser(user);
    stepData.set('twoFactorAuth', twoFactorList.length > 0);

    const twoFactorAuthSteps = [];
    if (twoFactorList.length > 0) {
      stepData.set('twoFactorAuthList', twoFactorList);
      twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    }

    stepData.steps = [...twoFactorAuthSteps, 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    return stepData;
  }

  async invite(ctx: KoaContext): Promise<StepData> {
    // here will send the invite email for reset password link
    const stepData = ctx.stepData as StepData;

    const userNo = stepData.get<string>('userNo');
    const userAccountName = stepData.get<string>('userAccountName');
    const userAppName = stepData.get<string>('userAppName');

    const targetUserAccountName = stepData.get<string>('targetUserAccountName');
    const targetUserAppNo = stepData.get<string>('targetUserAppNo');
    const targetUserEmail = stepData.get<string>('targetUserEmail');
    const targetUserResetPasswordAddress = stepData.get<string>('targetUserAppDomainAddress');
    const targetUserPasswordLinkExpireTime = stepData.get<string>('targetUserPasswordLinkExpireTime');

    const newStepData = ctx.createStepData('resetPassword', targetUserPasswordLinkExpireTime);
    newStepData.set('operatorUserNo', userNo);
    newStepData.set('targetUserAccountName', targetUserAccountName);
    newStepData.set('targetUserAppNo', targetUserAppNo);
    const resetPasswordLinkAddress = targetUserResetPasswordAddress + `/#/resetPassword?inviteToken=${newStepData.token}`;
    newStepData.set('resetPasswordLinkAddress', resetPasswordLinkAddress);
    await newStepData.save();

    if (targetUserEmail) {
      // send the email
      this.logger.info(`send the reset password email to user. ${userAccountName} ${userAppName} ${targetUserAccountName}`);
    }

    stepData.set('resetPasswordLinkAddress', resetPasswordLinkAddress);
    return stepData;
  }
}
