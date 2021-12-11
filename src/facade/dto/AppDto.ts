import { SwaggerDefinition } from "@augejs/koa-swagger"

@SwaggerDefinition({
  properties: {
    logoImg: { type: 'string', example: null },
    title: {  type: 'string' },
    emailAddr: {type: 'string' }
  },
})
export class AppCreateDto {
  logoImg?: string
  title!: string
  emailAddr!: string
}
