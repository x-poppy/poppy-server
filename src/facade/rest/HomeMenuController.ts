import { HomeMenuTreeBo } from '@/domain/bo/HomeMenuTreeBo';
import { PermissionsBo } from '@/domain/bo/PermissionsBo';
import { HomeMenuService } from '@/domain/service/HomeMenuService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/resource/home-menu')
@Provider()
export class HomeMenuController {
  @Inject(HomeMenuService)
  private homeMenuService!: HomeMenuService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(@RequestParams.Context() context: KoaContext): Promise<HomeMenuTreeBo | null> {
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    const permissionsJson = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? null;
    const permissions = PermissionsBo.fromJSON(permissionsJson);
    const menuTree = await this.homeMenuService.findMenuTreeByAppNo(appNo, permissions);
    return menuTree;
  }
}
