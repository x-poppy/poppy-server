import { KoaContext, RequestParams } from "@augejs/koa";

export function RequestAppId(): ParameterDecorator {
  return RequestParams((ctx: KoaContext): string => {
    return ctx.get('app-id');
  })
}
