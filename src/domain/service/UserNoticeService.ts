import ejs from 'ejs';

import { MailService } from '@/infrastructure/service/MailService';
import { GetLogger, ILogger, Inject, Provider, Value } from '@augejs/core';

import { AppEntity } from '../model/AppEntity';
import { UserEntity } from '../model/UserEntity';
import { AppConfigService } from './AppConfigService';
import { RenderFunction, VIEWS_IDENTIFIER } from '@augejs/views';

interface SendResetPasswordLinkOpts {
  operatorAppNo: string;
  operatorAppName: string;
  targetUserNo: string;
  targetUserAccountName: string;
  targetUserEmail: string;
  resetPasswordLinkAddress: string;
}

@Provider()
export class UserNoticeService {
  @GetLogger()
  private logger!: ILogger;

  @Value('/mail.auth.user')
  private mailFrom!: string;

  @Inject(VIEWS_IDENTIFIER)
  private render!: RenderFunction;

  @Inject(MailService)
  private mailService!: MailService;

  @Inject(AppConfigService)
  private appConfigService!: AppConfigService;

  async sendResetPasswordLink(opts: SendResetPasswordLinkOpts): Promise<void> {
    const emailAddr = opts.targetUserEmail;

    let subjectTemplate = (await this.appConfigService.getResetPasswordEmailSubjectTemplate(opts.operatorAppNo)) ?? '';
    if (!subjectTemplate) {
      subjectTemplate = '[<%= teamName%>] Reset Your Password';
    }
    const emailSubject = ejs.render(subjectTemplate, {
      teamName: opts.operatorAppName,
    });

    const emailContentTemplate = await this.appConfigService.getResetPasswordEmailContentTemplate(opts.operatorAppNo);
    const emailContentState = {
      accountName: opts.targetUserAccountName,
      teamName: opts.operatorAppName,
      resetPasswordLink: opts.resetPasswordLinkAddress,
    };
    let emailContent = '';
    if (!emailContentTemplate) {
      emailContent = await this.render('email/resetPasswordEmail.ejs', emailContentState);
    } else {
      emailContent = ejs.render(emailContentTemplate, emailContentState);
    }

    await this.mailService.send({
      from: this.mailFrom,
      to: emailAddr,
      subject: emailSubject,
      html: emailContent,
    });

    this.logger.info(`targetUserAccountName: ${opts.targetUserAccountName} targetUserNo: ${opts.targetUserNo} operatorAppNo: ${opts.operatorAppNo} sendResetPasswordLink.`);
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
      from: this.mailFrom,
      to: emailAddr,
      subject: emailSubject,
      html: emailContent,
    });

    this.logger.info(`useNo: ${user.userNo} appNo: ${user.appNo} sendCreateAccountLink`);
  }
}
