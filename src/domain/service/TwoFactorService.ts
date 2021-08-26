import { TwoFactorAuthDto } from '@/facade/dto/TwoFactorAuthDto';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { OneTimePasswordService } from '@/infrastructure/service/OneTimePasswordService';
import { BusinessError, ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';

@Provider()
export class TwoFactorService {
  @GetLogger()
  logger!: ILogger;

  @Inject(UserRepository)
  userRepository!: UserRepository;

  @Inject(OneTimePasswordService)
  oneTimePasswordService!: OneTimePasswordService;

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

    const userNo = stepData.get<string>('userNo');

    const user = await this.userRepository.findByStatusNormal(userNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (!user.optKey) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Opt_Key_Empty_Error);
    }

    // do the validate
    const verifyResult = await this.oneTimePasswordService.verify(twoFactorAuthDto.code, user.optKey);
    if (!verifyResult) {
      this.logger.warn(`User_Name_Or_Password_Is_InCorrect. userNo: ${userNo}`);
      throw new ClientValidationError(I18nMessageKeys.User_Name_Or_Password_Is_InCorrect);
    }

    const newStepData = ctx.createStepData(stepData.sessionName, stepData.maxAge, stepData.toJSON());
    newStepData.popStep();
    await newStepData.save();
    ctx.stepData = newStepData;

    return newStepData;
  }
}
