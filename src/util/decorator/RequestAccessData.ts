import { PPAccessData, PPAccessDataReadyOnlyKeyType } from "@/types/PPAccessData";
import { KoaContext, RequestParams } from "@augejs/koa";

export function RequestAccessData(): ParameterDecorator {
  return RequestParams((ctx: KoaContext): PPAccessData => {
    return ctx.accessData as PPAccessData;
  })
}

export function RequestAccessDataValue<T=string>(key: PPAccessDataReadyOnlyKeyType): ParameterDecorator {
  return RequestParams((ctx: KoaContext): T => {
    const accessData = ctx.accessData as PPAccessData;
    return accessData.get<T>(key);
  })
}
