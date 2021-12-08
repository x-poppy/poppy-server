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
import { RestPasswordInviteDto } from '@/facade/admin/dto/RestPasswordInviteDto';
import { ResetPasswordDto } from '@/facade/admin/dto/ResetPasswordDto';
import { SessionService } from './SessionService';
import { UserService } from './UserService';
import { PasswordService } from '@/infrastructure/service/PasswordService';

@Provider()
export class ResetPasswordService {
  @GetLogger()
  private logger!: ILogger;

  @Inject(SessionService)
  private sessionService!: SessionService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(AppConfigService)
  appConfigService!: AppConfigService;

  async update(ctx: KoaContext, resetPasswordDto: ResetPasswordDto): Promise<void> {
    const inviteStepData = ctx.stepData as StepData;

    const userName = inviteStepData.get<string>('targetUserAccountName');
    const appNo = inviteStepData.get<string>('targetUserAppNo');

    if (appNo !== resetPasswordDto.appNo) {
      this.logger.warn(`App_Is_Not_Exist from expect appNo ${appNo} current appNo ${resetPasswordDto.appNo}.`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const { user } = await this.userService.findAndVerifyLoginUser({
      userName,
      appNo,
    });

    const userNo = user.userNo;

    const hashPassword = await this.passwordService.hashPwd(userNo, user.nonce, resetPasswordDto.password);

    await this.userService.updatePassword(userNo, hashPassword);

    await this.sessionService.kickOffAllOnlineUsers(ctx, userNo);
    this.logger.info(`reset password end.`);
  }
}
