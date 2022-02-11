import { MenuStatus } from "@/domain/model/MenuDO";
import { SwaggerDefinition } from "@augejs/koa-swagger";

@SwaggerDefinition({
  properties: {
    title: {  type: 'string' },
    menuCode: {  type: 'string' },
    status: {  type: 'string' },
  },
})
export class MenuListDTO {
  title?: string
  menuCode?: string
  status?: MenuStatus
}
