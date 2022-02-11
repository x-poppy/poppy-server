import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { CustomizedServiceAdapter } from "./CustomizedServiceAdapter";

export interface MailOpts {
  subject: string
  to: string | string[]
  text: string,
  html?: string
}

export interface MailServiceAdapter extends CustomizedServiceAdapter {
  send(mailOpts: MailOpts, customizedServiceDO: CustomizedServiceDO): void
}
