import { MenuTreeBo } from '@/domain/bo/MenuTreeBo';
import { PermissionsBo } from '@/domain/bo/PermissionsBo';
import { MenuService } from '@/domain/service/MenuService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/menu')
@Provider()
export class MenuController {
  @Inject(MenuService)
  private menuService!: MenuService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/menu-tree')
  async menuTree(@RequestParams.Context() context: KoaContext): Promise<MenuTreeBo[]> {
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    const permissionsJson = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? null;
    const permissions = PermissionsBo.fromJSON(permissionsJson);
    const menuTrees = await this.menuService.findMenuTreesByAppNo(appNo, permissions);
    return menuTrees;
  }
}
