import { LoginDto } from '@/facade/dto/LoginDto';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';
import { UserStatus } from '../model/UserEntity';

@Provider()
export class ForgetPasswordService {
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

  async auth(ctx: KoaContext, forgetPasswordDto: LoginDto): Promise<StepData> {
    this.logger.info(`auth start. userName ${forgetPasswordDto.userName} appNo: ${forgetPasswordDto.appNo}`);

    const app = await this.appRepository.findByStatusNormal(forgetPasswordDto.appNo);
    if (!app) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${forgetPasswordDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const user = await this.userRepository.findByAccountNameAndAppNo(forgetPasswordDto.userName, forgetPasswordDto.appNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${forgetPasswordDto.userName} appNo: ${forgetPasswordDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${forgetPasswordDto.userName} appNo: ${forgetPasswordDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Is_Locked. userName: ${forgetPasswordDto.userName} appNo: ${forgetPasswordDto.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    const twoFactorList = TwoFactorListBo.createFromUser(user);
    const twoFactorAuth = user.twoFactorAuth && twoFactorList.hasTwoFactorAbility;

    const hashPassword = await this.passwordService.hashPwd(user.userNo, user.nonce, forgetPasswordDto.password);

    const stepData = ctx.createStepData('forgetPassword');

    stepData.set('userNo', user.userNo);
    stepData.set('password', hashPassword);

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

    return stepData;
  }

  async update(ctx: KoaContext): Promise<void> {
    const stepData = ctx.stepData as StepData;

    const userNo = stepData.get<string>('userNo');
    const user = await this.userRepository.findByStatusNormal(userNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Is_Locked. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    const hashPassword = stepData.get<string>('password');
    this.userRepository.updateUserPassword(userNo, hashPassword);
  }
}
