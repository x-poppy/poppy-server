import { LoginDto } from '@/facade/dto/LoginDto';
import { PasswordService } from '@/infrastructure/service/PasswordService';
import { ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorItemBo';
import { SessionService } from './SessionService';
import { UserService } from './UserService';

@Provider()
export class ForgetPasswordService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(SessionService)
  private sessionService!: SessionService;

  async auth(ctx: KoaContext, forgetPasswordDto: LoginDto): Promise<StepData> {
    this.logger.info(`forget password start. userName ${forgetPasswordDto.userName} appNo: ${forgetPasswordDto.appNo}`);

    const { user } = await this.userService.findAndVerifyLoginUser(forgetPasswordDto);

    const twoFactorList = TwoFactorListBo.createFromUser(user);
    const needTwoFactorAuth = user.twoFactorAuth && twoFactorList.length > 0;
    if (!needTwoFactorAuth) {
      // error here
      this.logger.warn(`Forget_Password_Missing_Two_Factor_Error. userName: ${forgetPasswordDto.userName}`);
      throw new ClientValidationError(I18nMessageKeys.Forget_Password_Missing_Two_Factor_Error);
    }

    const hashPassword = await this.passwordService.hashPwd(user.userNo, user.nonce, forgetPasswordDto.password);

    const stepData = ctx.createStepData('forgetPassword');

    stepData.set('userNo', user.userNo);
    stepData.set('password', hashPassword);
    stepData.set('twoFactorAuth', needTwoFactorAuth);
    stepData.set('twoFactorAuthList', twoFactorList);

    const twoFactorAuthSteps = [];
    twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    stepData.steps = [...twoFactorAuthSteps, 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    this.logger.info(`auth end. userName ${forgetPasswordDto.userName} appNo: ${forgetPasswordDto.appNo}`);

    return stepData;
  }

  async update(ctx: KoaContext): Promise<void> {
    const stepData = ctx.stepData as StepData;
    const userNo = stepData.get<string>('userNo');
    const hashPassword = stepData.get<string>('password');
    await this.userService.updatePassword(userNo, hashPassword);

    await this.sessionService.kickOffAllOnlineUsers(ctx, userNo);
    this.logger.info(`forget password end.`);
  }
}
