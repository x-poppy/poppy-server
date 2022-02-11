import { RoleStatus } from "@/domain/model/RoleDO"
import { SwaggerDefinition } from "@augejs/koa-swagger"

export class RoleCreateDTO {
  title!: string
}

@SwaggerDefinition({
  properties: {
    title: { type: 'string' },
    status: { type: 'string', description: `${Object.values(RoleStatus).join(',')}` }
  },
})
export class RoleListDTO {
  title?: string
  status?: RoleStatus
}
