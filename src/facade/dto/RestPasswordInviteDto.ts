import { I18nValidatorDecorator, I18nValidatorOwner } from '@/util/decorator/I18nValidator';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { IsNotEmpty, ValidationArguments } from '@augejs/validator';

@I18nValidatorDecorator()
export class RestPasswordInviteDto {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      const validatorOwner = args.object as I18nValidatorOwner;
      validatorOwner.errorMessageValues = null;
      validatorOwner.errorMessageKey = I18nMessageKeys.Reset_Password_Invite_User_No_Empty_Error;
      return validatorOwner.errorMessageKey;
    },
  })
  userNo!: string;
}
