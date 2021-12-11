import { I18nValidatorDecorator, I18nValidatorOwner } from "@/util/decorator/I18nValidator";
import { I18nMessageKeys } from "@/util/I18nMessageKeys";
import { SwaggerDefinition } from "@augejs/koa-swagger";
import { Length, ValidationArguments } from "@augejs/validator";

@SwaggerDefinition({
  properties: {
    userName: {
      type: 'string',
      example: ""
    },
    password: {
      type: 'string',
      example: ''
    }
  },
})

@I18nValidatorDecorator()
export class SessionLoginDto {
  @Length(4, 64, {
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      validatorOwner.errorMessageKey = I18nMessageKeys.Login_User_Name_Length_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  userName!: string;

  @Length(6, 64, {
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      validatorOwner.errorMessageKey = I18nMessageKeys.Login_User_Password_Length_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  password!: string;
}
