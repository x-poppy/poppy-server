import { Module } from "@augejs/core";
import { AvatarServiceAdapterImpl } from "./AvatarServiceAdapterImpl";
import { MailServiceAdapterImpl } from "./MailServiceAdapterImpl";
import { ProxyServiceAdapter } from "./ProxyServiceAdapter";
import { WebHookServiceAdapter } from "./WebHookServiceAdapterImpl";

@Module({
  providers: [
    AvatarServiceAdapterImpl,
    MailServiceAdapterImpl,
    WebHookServiceAdapter,
    ProxyServiceAdapter,
  ]
})
export class CustomizedServiceAdapterModule {}
