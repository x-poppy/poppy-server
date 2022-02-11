import { Provider } from '@augejs/core';
import nodemailer from 'nodemailer';

interface MailOpts {
  transport: string
  from: string
  to: string | string[]
  subject: string
  text: string
  html?: string
}

@Provider()
export class MailService {
  // smtps://username:password@smtp.example.com/?pool=true
  // smtp://username:password@smtp.example.com/?pool=true
  send(opts: MailOpts): void {
    nodemailer.createTransport(opts.transport).sendMail({
      from: opts.from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  }
}
