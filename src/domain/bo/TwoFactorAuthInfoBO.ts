import { maskEmail, maskPhone } from "@/util/MaskUtil";
import { SwaggerDefinition } from "@augejs/koa-swagger";
import { TwoFactorAuthType } from "../model/UserCredentialDO"

@SwaggerDefinition({
  properties: {
    type: {  type: 'string' },
    data: {  type: 'string' },
  },
})
export class TwoFactorAuthInfoBO {

  static fromJSON(json: Record<string, string>):TwoFactorAuthInfoBO  {
    const info = new TwoFactorAuthInfoBO();
    info.type = json.type as TwoFactorAuthType;
    info.data = json.data as string ?? '';
    return info;
  }

  type: TwoFactorAuthType = TwoFactorAuthType.NONE;
  data = '';

  mask():void {
    if (this.type === TwoFactorAuthType.EMAIL) {
      this.data = maskEmail(this.data);
    } else if (this.type === TwoFactorAuthType.SMS) {
      this.data = maskPhone(this.data);
    }
  }
}
