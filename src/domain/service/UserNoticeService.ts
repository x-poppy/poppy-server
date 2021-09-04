import ejs from 'ejs';

import { MailService } from '@/infrastructure/service/MailService';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';

import { AppEntity } from '../model/AppEntity';
import { UserEntity } from '../model/UserEntity';
import { AppConfigService } from './AppConfigService';

@Provider()
export class UserNoticeService {
  @GetLogger()
  logger!: ILogger;

  @Inject(MailService)
  mailService!: MailService;

  @Inject(AppConfigService)
  appConfigService!: AppConfigService;

  async sendResetPasswordLink(useNo: string, resetPasswordLink: string): Promise<void> {
    const user = {} as UserEntity;

    const app = {} as AppEntity;

    const emailAddr = user.emailAddr;
    if (!emailAddr) return;

    const subjectTemplate = (await this.appConfigService.getResetPasswordEmailSubjectTemplate(app.appNo)) ?? '';
    if (!subjectTemplate) {
      this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} getResetPasswordEmailSubjectTemplate is empty!`);
      return;
    }

    const emailSubject = ejs.render(subjectTemplate, {
      appName: app.displayName,
    });

    const emailContentTemplate = await this.appConfigService.getResetPasswordEmailContentTemplate(app.appNo);
    if (!emailContentTemplate) {
      this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} getResetPasswordEmailContentTemplate is empty!`);
      return;
    }

    const emailContent = ejs.render(emailContentTemplate, {
      userName: user.accountName,
      appName: app.displayName,
      resetPasswordLink: resetPasswordLink,
    });

    await this.mailService.send({
      to: emailAddr,
      subject: emailSubject,
      html: emailContent,
    });

    this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} sendCreateAccountLink`);
  }

  async sendCaptcha(useNo: string, captcha: string): Promise<void> {
    const user = {} as UserEntity;

    const app = {} as AppEntity;

    const emailAddr = user.emailAddr;
    if (!emailAddr) return;

    const subjectTemplate = (await this.appConfigService.getResetPasswordEmailSubjectTemplate(app.appNo)) ?? '';
    if (!subjectTemplate) {
      this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} getResetPasswordEmailSubjectTemplate is empty!`);
      return;
    }

    const emailSubject = ejs.render(subjectTemplate, {
      appName: app.displayName,
    });

    const emailContentTemplate = await this.appConfigService.getResetPasswordEmailContentTemplate(app.appNo);
    if (!emailContentTemplate) {
      this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} getResetPasswordEmailContentTemplate is empty!`);
      return;
    }

    const emailContent = ejs.render(emailContentTemplate, {
      userName: user.accountName,
      appName: app.displayName,
      captcha: captcha,
    });

    await this.mailService.send({
      to: emailAddr,
      subject: emailSubject,
      html: emailContent,
    });

    this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} sendCreateAccountLink`);
  }
}
