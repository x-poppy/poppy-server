import { HeadIconBo } from '@/domain/bo/HeadIconBo';
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
    const permissionsJson = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? null;
    const permissions = PermissionsBo.fromJSON(permissionsJson);
    const menuTree = await this.headIconService.list(appNo, permissions);
    return menuTree;
  }
}
