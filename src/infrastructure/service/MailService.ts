import { Inject, Provider } from '@augejs/core';
import { Mail, MAIL_IDENTIFIER } from '@augejs/mail';

@Provider()
export class MailService {
  @Inject(MAIL_IDENTIFIER)
  mail!: Mail;

  send() {
    this.mail.sendMail({});
  }
}
