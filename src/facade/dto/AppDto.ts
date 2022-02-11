import { AppStatus } from "@/domain/model/AppDO"
import { SwaggerDefinition } from "@augejs/koa-swagger"

@SwaggerDefinition({
  properties: {
    logoImg: { type: 'string', example: null },
    title: {  type: 'string' },
    emailAddr: {type: 'string' }
  },
})
export class AppCreateDTO {
  logoImg?: string
  title!: string
  emailAddr!: string
}

@SwaggerDefinition({
  properties: {
    title: {  type: 'string' },
    status: {  type: 'string' },
  },
})
export class AppListDTO {
  title?: string
  status?: AppStatus
}

