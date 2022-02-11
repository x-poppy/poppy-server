import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { AdapterHttpService } from "@/infrastructure/service/AdapterHttpService";
import { ServiceModuleTag } from "@/util/decorator/ServiceModuleTag";
import { Inject, Provider } from "@augejs/core";
import { KoaContext } from "@augejs/koa";
import { CustomizedServiceAdapter } from "./CustomizedServiceAdapter";

@ServiceModuleTag()
@Provider()
export class ProxyServiceAdapter implements CustomizedServiceAdapter {

  @Inject(AdapterHttpService)
  private readonly adapterHttpService!: AdapterHttpService;

  async request(ctx: KoaContext, customizedServiceDO: CustomizedServiceDO, action?: string): Promise<void> {
    const response = await this.adapterHttpService.request(customizedServiceDO.apiUrl ?? '', {
      appId: customizedServiceDO.appId,
      serviceCode: customizedServiceDO.serviceCode,
      moduleCode: customizedServiceDO.moduleCode,
      apiKey: customizedServiceDO.apiKey,
      timeout: customizedServiceDO.timeout,
      mockResponse: customizedServiceDO.mockResponse,
      query: ctx.request.query,
      action,
      data: ctx.request.body,
    });

    ctx.type = response.headers['content-type'] ?? 'json';
    ctx.body = response.data;
  }
}
