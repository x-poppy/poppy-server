import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { getConnection } from 'typeorm';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';
import { AppConfigService } from './AppConfigService';

@Provider()
export class ResetPasswordService {
  @GetLogger()
  private logger!: ILogger;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(AppConfigService)
  appConfigService!: AppConfigService;

  async auth(ctx: KoaContext, userNo: string): Promise<StepData> {
    const user = await this.userRepository.find(userNo);

    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    const stepData = ctx.createStepData('resetPassword');
    const twoFactorList = TwoFactorListBo.createFromUser(user);
    stepData.set('twoFactorAuth', twoFactorList.length > 0);

    const twoFactorAuthSteps = [];
    if (twoFactorList.length > 0) {
      stepData.set('twoFactorAuthList', twoFactorList);
      twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    }

    stepData.steps = [...twoFactorAuthSteps, 'invite', 'verify', 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    return stepData;
  }

  async invite(ctx: KoaContext): Promise<StepData> {
    // here will send the invite email for reset password link
    const stepData = ctx.stepData as StepData;

    const userAppNo = '';

    const passwordLinkExpireTime = await this.appConfigService.getResetPasswordLinkExpireTime(userAppNo);

    const newStepData = ctx.createStepData(stepData.sessionName, passwordLinkExpireTime, stepData.toJSON());
    newStepData.popStep();
    await newStepData.save();

    return stepData;
  }

  async verify(ctx: KoaContext): Promise<void> {
    const stepData = ctx.stepData as StepData;
    const userNo = stepData.get<string>('userNo');

    const passwd = '';

    // verify the new password

    const newStepData = ctx.createStepData(stepData.sessionName, stepData.maxAge, stepData.toJSON());
    newStepData.popStep();
    newStepData.set('passwd', passwd);
    await newStepData.save();
    ctx.stepData = newStepData;
  }

  async update(ctx: KoaContext): Promise<void> {
    const stepData = ctx.stepData as StepData;
    const userNo = stepData.get<string>('userNo');
    const passwd = stepData.get<string>('passwd');

    const user = await this.userRepository.find(userNo);
    if (!user) {
      // this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${loginDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    await getConnection().createQueryRunner;

    this.userRepository.updateUserPassword(userNo, passwd);
  }
}
