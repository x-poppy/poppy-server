import { TwoFactorAuthDTO } from '@/facade/dto/TwoFactorAuthDTO';
import { OneTimePasswordService } from '@/infrastructure/service/OneTimePasswordService';
import { ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import RandomUtil from '@/util/RandomUtil';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { Commands, REDIS_IDENTIFIER } from '@augejs/redis';
import { TwoFactorAuthInfoBO } from '../bo/TwoFactorAuthInfoBO';
import { CustomizedServiceCode } from '../model/CustomizedServiceDO';
import { TwoFactorAuthType, UserCredentialDO } from '../model/UserCredentialDO';
import { CustomizedServiceService } from './CustomizedServiceService';
import { UserCredentialService } from './UserCredentialService';
import { UserService } from './UserService';

@Provider()
export class TwoFactorAuthService {
  @GetLogger()
  private readonly logger!: ILogger;

  @Inject(REDIS_IDENTIFIER)
  private readonly redis!: Commands;

  @Inject(OneTimePasswordService)
  private readonly oneTimePasswordService!: OneTimePasswordService;

  @Inject(UserService)
  private readonly userService!: UserService;

  @Inject(UserCredentialService)
  private readonly userCredentialService!: UserCredentialService;

  @Inject(CustomizedServiceService)
  private readonly customizedServiceService!: CustomizedServiceService;

  async info(stepData: StepData): Promise<TwoFactorAuthInfoBO> {
    const twoFactorAuthInfoBO = TwoFactorAuthInfoBO.fromJSON(stepData.get<Record<string, string>>('twoFactorAuthInfo'));
    twoFactorAuthInfoBO.mask();
    return twoFactorAuthInfoBO;
  }

  async sendCaptcha(stepData: StepData): Promise<string> {
    const userId = stepData.get<string>('userId');
    const appId = stepData.get<string>('appId');
    const sessionName = stepData.sessionName;
    const captcha = RandomUtil.randomNumberString(6);

    const twoFactorAuthServiceDO = await this.customizedServiceService.findAndVerify(appId, CustomizedServiceCode.TwoFactorAuth, true);
    const captchaMaxAge = Number(twoFactorAuthServiceDO?.parameters?.captchaExpireTime ?? 10 * 60 * 60);
    const twoFactorAuthInfoBO = TwoFactorAuthInfoBO.fromJSON(stepData.get<Record<string, string>>('twoFactorAuthInfo'))
    if (twoFactorAuthInfoBO.type == TwoFactorAuthType.EMAIL || twoFactorAuthInfoBO.type === TwoFactorAuthType.SMS) {
      const redisKey = `captcha-${sessionName}-${twoFactorAuthInfoBO.type}:${userId}:${twoFactorAuthInfoBO.data}`;
      await this.redis.set(redisKey, captcha, 'PX', captchaMaxAge);
    }

    this.logger.info(`send captcha. appId: ${appId}} userId: ${userId} sessionName: ${sessionName} captcha: ${captcha} captchaMaxAge: ${captchaMaxAge}`);

    return captcha;
  }

  async auth(ctx: KoaContext, twoFactorAuthDTO: TwoFactorAuthDTO): Promise<StepData> {
    const captcha = twoFactorAuthDTO.code;
    const stepData = ctx.stepData as StepData;
    const twoFactorAuthInfoBO = TwoFactorAuthInfoBO.fromJSON(stepData.get<Record<string, string>>('twoFactorAuthInfo'));
    let verifyResult = true;
    if (twoFactorAuthInfoBO.type === TwoFactorAuthType.OTP) {
      verifyResult = await this.oneTimePasswordService.verify(captcha, twoFactorAuthInfoBO.data);
    } else if (twoFactorAuthInfoBO.type == TwoFactorAuthType.EMAIL || twoFactorAuthInfoBO.type === TwoFactorAuthType.SMS) {
      const userId = stepData.get<string>('userId');
      const sessionName = stepData.sessionName;
      const redisKey = `captcha-${sessionName}-${twoFactorAuthInfoBO.type}:${userId}:${twoFactorAuthInfoBO.data}`;
      const targetCaptcha = await this.redis.get(redisKey);
      verifyResult = targetCaptcha === captcha;

      if (verifyResult) {
        await this.redis.del(redisKey);
      }
    }

    // do the validate
    if (!verifyResult) {
      this.logger.warn(`Two_Factor_Auth_Code_Error. type: ${twoFactorAuthInfoBO.type} code: ${captcha}`);
      throw new ClientValidationError(I18nMessageKeys.Two_Factor_Auth_Code_Error);
    }

    const newStepData = ctx.createStepData(stepData.sessionName, stepData.maxAge, stepData.toJSON());
    newStepData.popStep();
    await newStepData.save();
    ctx.stepData = newStepData;

    return newStepData;
  }

  async findTwoFactorAuthInfo(userId: string): Promise<TwoFactorAuthInfoBO> {
    const twoFactorAuthBO = new TwoFactorAuthInfoBO();
    twoFactorAuthBO.type = TwoFactorAuthType.NONE;

    const user = await this.userService.findOne({ id: userId }, { select: ['appId', 'mobileNo', 'emailAddr'] });
    if (!user) {
      return twoFactorAuthBO;
    }

    const isTwoFactorAuthServiceAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.TwoFactorAuth);
    if (!isTwoFactorAuthServiceAvailable) {
      return twoFactorAuthBO;
    }

    const userCredential = await this.userCredentialService.findOne({ userId }, { select: ['otpKey', 'twoFactorAuthType']}) as UserCredentialDO;
    if (!userCredential) {
      return twoFactorAuthBO;
    }

    const userTwoFactorAuthType = userCredential.twoFactorAuthType;
    if (userTwoFactorAuthType === TwoFactorAuthType.EMAIL) {
      if (user.emailAddr) {
        const isEmailChannelAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.Email);
        if (isEmailChannelAvailable) {
          twoFactorAuthBO.type = userTwoFactorAuthType;
          twoFactorAuthBO.data = user.emailAddr;
        }
      }
    } else if (userTwoFactorAuthType === TwoFactorAuthType.SMS) {
      if (user.mobileNo) {
        const isSmsChannelAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.SMS);
        if (isSmsChannelAvailable) {
          twoFactorAuthBO.type = userTwoFactorAuthType;
          twoFactorAuthBO.data = user.mobileNo;
        }
      }
    } else if (userTwoFactorAuthType === TwoFactorAuthType.OTP) {
      if (userCredential.otpKey) {
        const isOptChannelAvailable = await this.customizedServiceService.checkServiceAvailable(user.appId, CustomizedServiceCode.Email);
        if (isOptChannelAvailable) {
          twoFactorAuthBO.type = userTwoFactorAuthType;
          twoFactorAuthBO.data = userCredential.otpKey;
        }
      }
    }

    return twoFactorAuthBO;
  }
}
