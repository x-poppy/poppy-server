import { TwoFactorAuthDto } from '@/facade/dto/TwoFactorAuthDto';
import { OneTimePasswordService } from '@/infrastructure/service/OneTimePasswordService';
import { BusinessError, ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListItemBo } from '../bo/TwoFactorItemBo';
import { CustomizedServiceCode } from '../model/CustomizedServiceEntity';
import { UserCredentialEntity } from '../model/UserCredentialEntity';
import { UserStatus } from '../model/UserEntity';
import { CustomizedServiceService } from './CustomizedServiceService';
import { UserCredentialService } from './UserCredentialService';
import { UserService } from './UserService';

@Provider()
export class TwoFactorAuthService {
  @GetLogger()
  logger!: ILogger;

  @Inject(OneTimePasswordService)
  oneTimePasswordService!: OneTimePasswordService;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(UserCredentialService)
  private userCredentialService!: UserCredentialService;

  @Inject(CustomizedServiceService)
  private customizedServiceService!: CustomizedServiceService;

  async list(ctx: KoaContext): Promise<StepData> {
    const stepData = ctx.stepData as StepData;

    const newStepData = ctx.createStepData(stepData.sessionName, stepData.maxAge, stepData.toJSON());
    newStepData.popStep();
    await newStepData.save();
    ctx.stepData = newStepData;

    return newStepData;
  }

  async auth(ctx: KoaContext, twoFactorAuthDto: TwoFactorAuthDto): Promise<StepData> {
    const stepData = ctx.stepData as StepData;

    const userId = stepData.get<string>('userId');
    const user = await this.userService.findOne({ id: userId, status: UserStatus.NORMAL });
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userId: ${userId}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    // if (!user.optKey) {
    //   this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
    //   throw new BusinessError(I18nMessageKeys.User_Opt_Key_Empty_Error);
    // }

    // do the validate
    const verifyResult = await this.oneTimePasswordService.verify(twoFactorAuthDto.code, "");
    if (!verifyResult) {
      this.logger.warn(`User_Name_Or_Password_Is_InCorrect. userNo: ${userId}`);
      throw new ClientValidationError(I18nMessageKeys.Login_User_Name_Or_Password_Is_InCorrect);
    }

    const newStepData = ctx.createStepData(stepData.sessionName, stepData.maxAge, stepData.toJSON());
    newStepData.popStep();
    await newStepData.save();
    ctx.stepData = newStepData;

    return newStepData;
  }

  async verify(): Promise<boolean> {
    return true;
  }

  async findTwoFactorList(userId: string): Promise<TwoFactorListItemBo[]> {
    const user = await this.userService.findOne({ id: userId }, { select: ['mobileNo', 'emailAddr'] });
    if (!user) return [];

    const userCredential = await this.userCredentialService.findOne({ userId }, { select: ['otpKey']}) as UserCredentialEntity;
    if (!userCredential) return [];

    const twoFactorList = [];
    const userTwoFactorAuth = userCredential.twoFactorAuth;
    if (userTwoFactorAuth) {
      if (user.mobileNo) {
        const isSmsChannelAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.SMS);
        if (isSmsChannelAvailable) {
          twoFactorList.push({
            type: CustomizedServiceCode.SMS,
            data: user.mobileNo,
          });
        }
      }

      if (user.emailAddr) {
        const isEmailChannelAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.EMAIL);
        if (isEmailChannelAvailable) {
          twoFactorList.push({
            type: CustomizedServiceCode.EMAIL,
            data: user.emailAddr
          });
        }
      }

      if (userCredential.otpKey) {
        const isOptChannelAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.EMAIL);
        if (isOptChannelAvailable) {
          twoFactorList.push({
            type: CustomizedServiceCode.OTP,
            data: '',
          });
        }
      }
    }

    return twoFactorList;
  }
}
