import { I18nValidatorDecorator, I18nValidatorOwner } from '@/util/decorator/I18nValidator';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { SwaggerDefinition } from '@augejs/koa-swagger';
import { Length, ValidationArguments } from '@augejs/validator';

@SwaggerDefinition({
  properties: {
    code: {
      type: 'string',
    },
  },
})
@I18nValidatorDecorator()
export class TwoFactorAuthDTO {
  @Length(6, 8, {
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      validatorOwner.errorMessageKey = I18nMessageKeys.Two_Factor_Auth_Code_Length_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  code!: string;
}
