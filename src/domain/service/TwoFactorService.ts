import { TwoFactorAuthDto } from '@/facade/dto/TwoFactorAuthDto';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { OneTimePasswordService } from '@/infrastructure/service/OneTimePasswordService';
import { BusinessError, ClientValidationError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { SessionData } from '@augejs/koa-session-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';

@Provider()
export class TwoFactorService {
  @GetLogger()
  logger!: ILogger;

  @Inject(UserRepository)
  userRepository!: UserRepository;

  @Inject(OneTimePasswordService)
  oneTimePasswordService!: OneTimePasswordService;

  async list(userNo: string): Promise<TwoFactorListBo> {
    const user = await this.userRepository.findByStatusNormal(userNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userNo: ${userNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    return TwoFactorListBo.createFromUser(user);
  }

  async auth(ctx: KoaContext, twoFactorAuthDto: TwoFactorAuthDto): Promise<SessionData> {
    const preSessionData = ctx.sessionData as SessionData;

    const userNo = preSessionData.get<string>('userNo');

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

    const sessionData = ctx.createSessionData(preSessionData.sessionName, preSessionData.maxAge, preSessionData.toJSON());
    sessionData.commit();
    await sessionData.save();

    return sessionData;
  }
}
