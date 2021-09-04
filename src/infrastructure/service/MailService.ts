import { Inject, Provider } from '@augejs/core';
import { Mail, MAIL_IDENTIFIER } from '@augejs/mail';

@Provider()
export class MailService {
  @Inject(MAIL_IDENTIFIER)
  private mail!: Mail;

  async send(opts: Mail.Options): Promise<void> {
    this.mail.sendMail(opts);
  }
}
