import { I18nValidatorDecorator, I18nValidatorOwner } from '@/util/decorator/I18nValidator';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { IsNotEmpty, Length, ValidationArguments } from '@augejs/validator';

@I18nValidatorDecorator()
export class ResetPasswordDto {
  @Length(6, 32, {
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

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = null;
      validatorOwner.errorMessageKey = I18nMessageKeys.Login_App_No_Empty_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  appNo!: string;
}
