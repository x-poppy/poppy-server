import { UserCredentialRepository } from '@/infrastructure/repository/UserCredentialRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { UserCredentialEntity } from '../model/UserCredentialEntity';
import { PPService } from './PPService';

@Provider()
export class UserCredentialService extends PPService <UserCredentialEntity, UserCredentialRepository>{

  @GetLogger()
  private logger!: ILogger;

  @Inject(UserCredentialRepository)
  protected override repository!: UserCredentialRepository;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  async verifyPassword(userId: string, rawPassword: string): Promise<void> | never {
    const userCredential = await this.repository.findOne({ userId }, { select: ['nonce', 'passwd'] });
    if (!userCredential) {
      this.logger.info(`Login_User_Name_Or_Password_Is_InCorrect. userId: ${userId}`);
      throw new BusinessError(I18nMessageKeys.Login_User_Name_Or_Password_Is_InCorrect);
    }

    const isPassed = await this.passwordService.verify(userId, userCredential.nonce, rawPassword, userCredential.passwd)
    if (!isPassed) {
      this.logger.info(`Login_User_Name_Or_Password_Is_InCorrect. userId: ${userId}`);
      throw new BusinessError(I18nMessageKeys.Login_User_Name_Or_Password_Is_InCorrect);
    }
  }
}
