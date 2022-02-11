import { CustomizedServiceStatus } from "@/domain/model/CustomizedServiceDO"
import { SwaggerDefinition } from "@augejs/koa-swagger"

@SwaggerDefinition({
  properties: {
    title: {  type: 'string' },
    serviceCode: {  type: 'string' },
    moduleCode: {  type: 'string' },
    status: {  type: 'string' },
  },
})
export class CustomizedServiceListDTO {
  title?: string
  serviceCode?: string
  moduleCode?: string
  status?: CustomizedServiceStatus
}
