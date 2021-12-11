import { SwaggerDefinition } from "@augejs/koa-swagger";

@SwaggerDefinition({
  properties: {},
})
export class OrderDto {
  [key: string]: 'ASC' | 'DESC'
}
