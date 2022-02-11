import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { AdapterHttpService } from "@/infrastructure/service/AdapterHttpService";
import { MailService } from "@/infrastructure/service/MailService";
import { ServiceModuleTag } from "@/util/decorator/ServiceModuleTag";
import { Inject, Provider } from "@augejs/core";
import { MailServiceAdapter, MailOpts } from "./MailServiceAdapter";

@ServiceModuleTag('MailService')
@Provider()
export class MailServiceAdapterImpl implements MailServiceAdapter {
  @Inject(MailService)
  private readonly mailService!: MailService;

  @Inject(AdapterHttpService)
  private readonly adapterHttpService!: AdapterHttpService;

  send(mailOpts: MailOpts, customizedServiceDO: CustomizedServiceDO): void {
    const parameters = customizedServiceDO.parameters;

    if (!customizedServiceDO.apiUrl) {
      this.mailService.send({
        transport: parameters.transport as string,
        from: parameters.from as string,
        to: mailOpts.to,
        subject: mailOpts.subject,
        text: mailOpts.text,
        html: mailOpts.html,
      });
      return;
    }

    this.adapterHttpService.request(customizedServiceDO.apiUrl, {
      appId: customizedServiceDO.appId,
      serviceCode: customizedServiceDO.serviceCode,
      moduleCode: customizedServiceDO.moduleCode,
      apiKey: customizedServiceDO.apiKey,
      timeout: customizedServiceDO.timeout,
      mockResponse: customizedServiceDO.mockResponse,
      data: {
        from: parameters.from as string,
        to: mailOpts.to,
        subject: mailOpts.subject,
        text: mailOpts.text,
        html: mailOpts.html,
      }
    });
  }
}
