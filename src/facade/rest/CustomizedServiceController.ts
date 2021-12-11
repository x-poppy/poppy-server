import { CustomizedServiceService } from "@/domain/service/CustomizedServiceService";
import { Inject, Provider } from "@augejs/core";
import { KoaContext, Prefix, RequestMapping, RequestParams } from "@augejs/koa";
import { SwaggerTag } from "@augejs/koa-swagger";

@SwaggerTag({ name: 'CustomizedService'})
@Provider()
@Prefix('/api/v1/customized-service')
export class CustomizedServiceController {

  @Inject(CustomizedServiceService)
  private customizedServiceService!: CustomizedServiceService

  @RequestMapping.All('/callback/:appId/:serviceCode')
  async callback(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Params('appId') appId: string,
    @RequestParams.Params('serviceCode') serviceCode: string
  ): Promise<any> {
    return this.customizedServiceService.callback(ctx, appId, serviceCode);
  }
}
