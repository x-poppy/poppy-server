import { ChangePasswordDto } from '@/facade/dto/ChangePasswordDto';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';
import { PoppyAccessData } from '@/types/PoppyAccessData';
import { BusinessError, ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { I18n, I18N_IDENTIFIER } from '@augejs/i18n';
import { KoaContext } from '@augejs/koa';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';
import { SessionService } from './SessionService';
import { UserService } from './UserService';

@Provider()
export class ChangePasswordService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(SessionService)
  private sessionService!: SessionService;

  async auth(ctx: KoaContext, changePasswordDto: ChangePasswordDto): Promise<StepData> {
    this.logger.info(`change password start.`);

    const accessData = ctx.accessData as PoppyAccessData;
    const userNo = accessData.get('userNo');

    const user = await this.userRepository.find(userNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    const isSamePassword = changePasswordDto.oldPassword === changePasswordDto.password;
    if (isSamePassword) {
      this.logger.warn(`ChangPassword_The_Same_Password. userNo: ${userNo}`);
      throw new ClientValidationError(I18nMessageKeys.Chang_Password_Same_Password_Error);
    }

    const verifyOldPwdResult = await this.passwordService.verify(user.userNo, user.nonce, changePasswordDto.oldPassword, user.passwd);
    if (!verifyOldPwdResult) {
      // here is punish mechanism here for test the passwd.
      this.logger.warn(`User_Name_Or_Password_Is_InCorrect. userNo: ${userNo}`);
      throw new ClientValidationError(I18nMessageKeys.User_Name_Or_Password_Is_InCorrect);
    }

    const hashPassword = await this.passwordService.hashPwd(user.userNo, user.nonce, changePasswordDto.password);

    const twoFactorList = TwoFactorListBo.createFromUser(user);
    const needTwoFactorAuth = user.twoFactorAuth && twoFactorList.length > 0;

    const stepData = ctx.createStepData('changePassword');
    stepData.set('userNo', user.userNo);
    stepData.set('password', hashPassword);
    stepData.set('twoFactorAuth', needTwoFactorAuth);

    const twoFactorAuthSteps = [];
    if (needTwoFactorAuth) {
      stepData.set('twoFactorAuthList', twoFactorList);
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
    const hashPassword = stepData.get<string>('password');
    await this.userService.updatePassword(userNo, hashPassword);

    // kick of
    await this.sessionService.kickOffAllOnlineUsers(ctx, userNo);

    this.logger.info(`change password end.`);
  }
}
