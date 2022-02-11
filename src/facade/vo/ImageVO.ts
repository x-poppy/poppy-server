import { SwaggerDefinition } from "@augejs/koa-swagger";

@SwaggerDefinition({
  properties: {
    url: { type: 'string' },
  },
})
export class ImageVO {
  url!: string
}
