import { HeadMenuBo } from '@/domain/bo/HeadMenuBo';
import { PermissionsBo } from '@/domain/bo/PermissionsBo';
import { HeadMenuService } from '@/domain/service/HeadMenuService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/menu/head-menu')
@Provider()
export class HeadMenuController {
  @Inject(HeadMenuService)
  private headMenuService!: HeadMenuService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(@RequestParams.Context() context: KoaContext): Promise<HeadMenuBo[] | null> {
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    const permissionsJson = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? null;
    const permissions = PermissionsBo.fromJSON(permissionsJson);
    const menuTree = await this.headMenuService.list(appNo, permissions);
    return menuTree;
  }
}
