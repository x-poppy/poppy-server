import { SwaggerDefinition } from "@augejs/koa-swagger";

@SwaggerDefinition({
  properties: {},
})
export class OrderDTO {
  [key: string]: 'ASC' | 'DESC'
}
