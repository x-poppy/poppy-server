import { I18nValidatorDecorator, I18nValidatorOwner } from '@/util/decorator/I18nValidatorDecorator';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { Length, ValidationArguments } from '@augejs/validator';

@I18nValidatorDecorator()
export class LoginDto {
  @Length(4, 32, {
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

  @Length(5, 100, {
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      validatorOwner.errorMessageKey = I18nMessageKeys.Login_App_No_Length_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  appNo!: string;
}
