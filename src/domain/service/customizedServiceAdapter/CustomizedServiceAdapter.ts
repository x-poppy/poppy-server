import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO"
import { KoaContext } from "@augejs/koa"

export interface CustomizedServiceAdapter {
  request?(ctx: KoaContext, customizedServiceDO: CustomizedServiceDO): Promise<void>
}
