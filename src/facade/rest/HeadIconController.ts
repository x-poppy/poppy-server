import { HeadIconBo } from '@/domain/bo/HeadIconBo';
import { MenuTreeBo } from '@/domain/bo/MenuTreeBo';
import { PermissionsBo } from '@/domain/bo/PermissionsBo';
import { HeadIconService } from '@/domain/service/HeadIconService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/head-icon')
@Provider()
export class HeadIconController {
  @Inject(HeadIconService)
  private headIconService!: HeadIconService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(@RequestParams.Context() context: KoaContext): Promise<HeadIconBo[] | null> {
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    const permissions = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? {};
    const permissionsBo = new PermissionsBo(permissions);
    const menuTree = await this.headIconService.list(appNo, permissionsBo);
    return menuTree;
  }
}
