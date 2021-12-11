/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomizedServiceEntity } from "@/domain/model/CustomizedServiceEntity";
import { KoaContext } from "@augejs/koa";

export interface CustomizedServiceModule {
  request(ctx: KoaContext, appId:string, serviceCode: string, customizedService: CustomizedServiceEntity): Promise<any>;
  callback(ctx: KoaContext, appId: string, serviceCode: string, customizedService: CustomizedServiceEntity): Promise<any>
}
