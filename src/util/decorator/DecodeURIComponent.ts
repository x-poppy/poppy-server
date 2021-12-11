import { RequestParams } from "@augejs/koa";

export function DecodeURIComponent(): ParameterDecorator {
  return RequestParams((value?: unknown): unknown => {
    if (typeof value === 'string') {
      return decodeURIComponent(value);
    }

    return value;
  })
}
