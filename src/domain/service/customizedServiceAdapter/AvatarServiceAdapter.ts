import { CustomizedServiceDO } from "@/domain/model/CustomizedServiceDO";
import { ImageVO } from "@/facade/vo/ImageVO";
import { KoaContext } from "@augejs/koa";
import { CustomizedServiceAdapter } from "./CustomizedServiceAdapter";

export interface ListOpts {
  category?: string
}

export interface AvatarServiceAdapter extends CustomizedServiceAdapter {
  list(ctx: KoaContext, customizedServiceDO:CustomizedServiceDO, opts?:ListOpts): Promise<ImageVO[]>
}
