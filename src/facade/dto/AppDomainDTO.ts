import { AppDomainStatus } from "@/domain/model/AppDomainDO";
import { SwaggerDefinition } from "@augejs/koa-swagger"

@SwaggerDefinition({
  properties: {
    domain: {  type: 'string' },
  },
})
export class AppDomainCreateDTO {
  domain?: string
}

@SwaggerDefinition({
  properties: {
    domain: {  type: 'string' },
    status: {  type: 'string' },
  },
})
export class AppDomainListDTO {
  domain?: string
  status?: AppDomainStatus;
}
