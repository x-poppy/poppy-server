import { Inject, Provider } from '@augejs/core';
import { AppConfigRepository } from '@/infrastructure/repository/AppConfigRepository';

@Provider()
export class AppConfigService {
  @Inject(AppConfigRepository)
  private appConfigRepository!: AppConfigRepository;

  async getMaxOnlineUserCount(appNo: string): Promise<number> {
    const maxOnlineUserCountStr = await this.appConfigRepository.findValueByStatusNormal(appNo, 'Reset_Password_Link_Expire_Time');
    const maxOnlineUserCount = maxOnlineUserCountStr ? parseInt(maxOnlineUserCountStr) ?? 1 : 1;
    return maxOnlineUserCount;
  }

  async getResetPasswordEmailSubjectTemplate(appNo: string): Promise<string | undefined> {
    return this.appConfigRepository.findValueByStatusNormal(appNo, 'Reset_Password_Email_Subject_Template');
  }

  async getResetPasswordEmailContentTemplate(appNo: string): Promise<string | undefined> {
    return this.appConfigRepository.findValueByStatusNormal(appNo, 'Reset_Password_Email_Content_Template');
  }

  async getCaptchaEmailSubjectTemplate(appNo: string): Promise<string | undefined> {
    return this.appConfigRepository.findValueByStatusNormal(appNo, 'Captcha_Email_Subject_Template');
  }

  async getCaptchaEmailContentTemplate(appNo: string): Promise<string | undefined> {
    return this.appConfigRepository.findValueByStatusNormal(appNo, 'Captcha_Email_Content_Template');
  }

  async getResetPasswordLinkExpireTime(appNo: string): Promise<string> {
    return (await this.appConfigRepository.findValueByStatusNormal(appNo, 'Reset_Password_Link_Expire_Time')) ?? '24h';
  }
}
