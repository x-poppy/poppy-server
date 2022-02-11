import { SwaggerDefinition } from "@augejs/koa-swagger"


@SwaggerDefinition({
  properties: {
    title: {  type: 'string' },
    key: {  type: 'string' },
    value: {  type: 'string' },
  },
})
export class I18nCreateOrUpdateDTO {
  locale?: string
  key?: string
  value?: string
}

@SwaggerDefinition({
  properties: {
    title: {  type: 'string' },
    key: {  type: 'string' },
    value: {  type: 'string' },
  },
})
export class I18nListDTO {
  locale?: string
  key?: string
  value?: string
}
