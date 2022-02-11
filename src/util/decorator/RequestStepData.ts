import { KoaContext, RequestParams } from "@augejs/koa";
import { StepData } from "@augejs/koa-step-token";

export function RequestStepData(): ParameterDecorator {
  return RequestParams((ctx: KoaContext): StepData => {
    return ctx.stepData as StepData;
  })
}
