import { UserAvatarVO } from "@/facade/vo/UserAvatarVO";
import { Inject, Provider } from "@augejs/core";
import { KoaContext } from "@augejs/koa";
import { CustomizedServiceCode } from "../model/CustomizedServiceEntity";
import { CustomizedServiceService } from "./CustomizedServiceService";

@Provider()
export class UserAvatarService {

  @Inject(CustomizedServiceService)
  private customizedServiceService!: CustomizedServiceService;

 async list(ctx: KoaContext, appId: string): Promise<UserAvatarVO[]> {
  const avatarService = await this.customizedServiceService.findAndVerify(appId, CustomizedServiceCode.AVATAR, true);
  if (!avatarService) return [];
  return this.customizedServiceService.request(ctx, appId, CustomizedServiceCode.AVATAR);
 }
}
