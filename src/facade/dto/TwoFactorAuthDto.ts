import { I18nValidatorDecorator, I18nValidatorOwner } from '@/util/decorator/I18nValidatorDecorator';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { IsIn, Length, ValidationArguments } from '@augejs/validator';

@I18nValidatorDecorator()
export class TwoFactorAuthDto {
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

  @IsIn(['opt'], {
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = {
        values: (args.constraints as string[]).join(','),
      };
      validatorOwner.errorMessageKey = I18nMessageKeys.Two_Factor_Auth_Type_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  type!: string;
}
