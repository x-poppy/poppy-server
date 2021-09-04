import { Inject, Provider } from '@augejs/core';
import { AppConfigRepository } from '@/infrastructure/repository/AppConfigRepository';

@Provider()
export class AppConfigService {
  @Inject(AppConfigRepository)
  private appConfigRepository!: AppConfigRepository;

  private async getValueWidthDefault(appNo: string, key: string): Promise<string | undefined> {
    let appConfigEntity = await this.appConfigRepository.findByStatusNormal({
      appNo,
      key,
    });

    if (!appConfigEntity) {
      appConfigEntity = await this.appConfigRepository.findByStatusNormal({
        appNo: '0',
        key,
      });
    }

    return appConfigEntity?.value ?? undefined;
  }

  async getMaxOnlineUserCount(appNo: string): Promise<number> {
    const maxOnlineUserCountStr = await this.getValueWidthDefault(appNo, 'Reset_Password_Link_Expire_Time');
    const maxOnlineUserCount = maxOnlineUserCountStr ? parseInt(maxOnlineUserCountStr) ?? 1 : 1;
    return maxOnlineUserCount;
  }

  async getResetPasswordEmailSubjectTemplate(appNo: string): Promise<string | undefined> {
    return this.getValueWidthDefault(appNo, 'Reset_Password_Email_Subject_Template');
  }

  async getResetPasswordEmailContentTemplate(appNo: string): Promise<string | undefined> {
    return this.getValueWidthDefault(appNo, 'Reset_Password_Email_Content_Template');
  }

  async getCaptchaEmailSubjectTemplate(appNo: string): Promise<string | undefined> {
    return this.getValueWidthDefault(appNo, 'Captcha_Email_Subject_Template');
  }

  async getCaptchaEmailContentTemplate(appNo: string): Promise<string | undefined> {
    return this.getValueWidthDefault(appNo, 'Captcha_Email_Content_Template');
  }

  async getResetPasswordLinkExpireTime(appNo: string): Promise<string> {
    return (await this.getValueWidthDefault(appNo, 'Reset_Password_Link_Expire_Time')) ?? '24h';
  }
}
