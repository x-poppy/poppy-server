import { I18nValidatorOwner } from "@/util/decorator/I18nValidator";
import { I18nMessageKeys } from "@/util/I18nMessageKeys";
import { SwaggerDefinition } from "@augejs/koa-swagger"
import { IsEmail, Length, ValidationArguments } from "class-validator";

@SwaggerDefinition({
  properties: {
    emailAddr: { type: 'string' },
    headerImg: { type: 'string' },
    roleId: { type: 'string' },
  },
  required: ['emailAddr']
})
export class UserCreateDto {
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
  @IsEmail()
  emailAddr!: string
  headerImg?: string
  appId?: string
  roleId?: string
}

export class UserListDto {
  appLevel?: number
}
