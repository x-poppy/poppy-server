import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { ImageVO } from "@/facade/vo/ImageVO";
import { AdapterHttpService } from "@/infrastructure/service/AdapterHttpService";
import { ServiceModuleTag } from "@/util/decorator/ServiceModuleTag";
import { Inject, Provider } from "@augejs/core";
import { KoaContext } from "@augejs/koa";
import { AvatarServiceAdapter, ListOpts } from "./AvatarServiceAdapter";

@ServiceModuleTag('AvatarService')
@Provider()
export class AvatarServiceAdapterImpl implements AvatarServiceAdapter {

  @Inject(AdapterHttpService)
  private readonly adapterHttpService!: AdapterHttpService;

  async list(ctx: KoaContext, customizedServiceDO: CustomizedServiceDO, opts?: ListOpts): Promise<ImageVO[]> {
    const response = await this.adapterHttpService.request(customizedServiceDO.apiUrl ?? '', {
      appId: customizedServiceDO.appId,
      serviceCode: customizedServiceDO.serviceCode,
      moduleCode: customizedServiceDO.moduleCode,
      apiKey: customizedServiceDO.apiKey,
      timeout: customizedServiceDO.timeout,
      mockResponse: customizedServiceDO.mockResponse,
      data: {
        category: opts?.category
      }
    });

    const responseData = response.data;
    if (!responseData || !Array.isArray(responseData)) {
      return [];
    }

    return responseData
      .filter(responseItem => {
        if (!opts?.category) return true;
        if (!responseItem.category) return true;
        if (typeof responseItem.category !== 'string') return true;

        return (responseItem.category as string).includes(opts.category);
      })
      .map(responseItem => {
        const imageVO: ImageVO = new ImageVO();
        imageVO.url = responseItem.url;
        return imageVO;
    })
  }
}
