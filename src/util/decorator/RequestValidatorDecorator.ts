import { RequestParams } from "@augejs/koa";
import { ClassType, transformAndValidate, ValidationError } from "@augejs/validator";
import { ClientValidationError } from "../BusinessError";
import { I18nMessageKeys } from "../I18nMessageKeys";

// eslint-disable-next-line @typescript-eslint/ban-types
export function RequestValidator<T extends object>(classType: ClassType<T>): ParameterDecorator {
  return RequestParams(async (input: any) => {
    try {
      const result = await transformAndValidate<T>(classType, input,  {
        validator: {
          // stopAtFirstError: true,
        }
      });

      return result;
    } catch (err) {
      if (Array.isArray(err) && err[0] instanceof ValidationError) {
        const validError = err[0];
        const target = validError.target as Record<string, unknown>;
        if (target.errorMessageKey) {
          throw new ClientValidationError(target.errorMessageKey as string, {
            errorMessageValues: target.errorMessageValues as any ?? null,
            errorDetail: validError,
          });
        } else {
          throw new ClientValidationError(I18nMessageKeys.Common_Client_Validation_Error);
        }
      }
    }
  })
}
