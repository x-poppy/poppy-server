import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { ServiceModuleTag } from "@/util/decorator/ServiceModuleTag";
import { Provider } from "@augejs/core";
import { KoaContext } from "@augejs/koa";
import { CustomizedServiceAdapter } from "./CustomizedServiceAdapter";

@ServiceModuleTag('WebHookService')
@Provider()
export class WebHookServiceAdapter implements CustomizedServiceAdapter {

}
