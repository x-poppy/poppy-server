import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { Length, Validate, ValidationArguments } from '@augejs/validator';

export class LoginDto {
  errorMessageKey: string | null = null;
  errorMessageValues: Record<string, unknown> | null = null;

  @Length(4, 32, {
    message: (args: ValidationArguments) => {
      const self = args.object as LoginDto;
      self.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      self.errorMessageKey = I18nMessageKeys.Login_User_Name_Length_Error;
      return self.errorMessageKey;
    },
  })
  userName!: string;

  @Length(6, 32, {
    message: (args: ValidationArguments) => {
      const self = args.object as LoginDto;
      self.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      self.errorMessageKey = I18nMessageKeys.Login_User_Password_Length_Error;
      return self.errorMessageKey;
    },
  })
  password!: string;

  @Length(5, 100, {
    message: (args: ValidationArguments) => {
      const self = args.object as LoginDto;
      self.errorMessageValues = {
        min: args.constraints[0],
        max: args.constraints[1],
      };
      self.errorMessageKey = I18nMessageKeys.Login_Domain_Length_Error;
      return self.errorMessageKey;
    },
  })
  domain!: string;
}
