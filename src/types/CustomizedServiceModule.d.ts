/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { KoaContext } from "@augejs/koa";

export interface CustomizedServiceModule {
  request(ctx: KoaContext, appId:string, serviceCode: string, customizedService: CustomizedServiceDO): Promise<any>;
  callback(ctx: KoaContext, appId: string, serviceCode: string, customizedService: CustomizedServiceDO): Promise<any>
}
