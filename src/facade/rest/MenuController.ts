import { MenuTreeBo } from '@/domain/bo/MenuTreeBo';
import { PermissionsBo } from '@/domain/bo/PermissionsBo';
import { MenuPosition } from '@/domain/model/MenuEntity';
import { PageEntity } from '@/domain/model/PageEntity';
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
  @RequestMapping.Get('/head-menu')
  async headMenuList(@RequestParams.Context() context: KoaContext): Promise<MenuTreeBo[]> {
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    const permissionsJson = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? null;
    const permissions = PermissionsBo.fromJSON(permissionsJson);
    const menuTrees = await this.menuService.findMenuTreesByAppNo(appNo, permissions, MenuPosition.HEAD);
    return menuTrees;
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/home-menu')
  async homeMenuList(@RequestParams.Context() context: KoaContext): Promise<MenuTreeBo[]> {
    const appNo = (context.accessData?.get('appNo') as string) ?? null;
    const permissionsJson = context.accessData?.get<Record<string, boolean>>('userPermissions') ?? null;
    const permissions = PermissionsBo.fromJSON(permissionsJson);
    const menuTrees = await this.menuService.findMenuTreesByAppNo(appNo, permissions, MenuPosition.HOME);
    return menuTrees;
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/page/:menuCode')
  async showPage(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params('menuCode') menuCode: string): Promise<PageEntity | null> {
    const page = await this.menuService.showPage(ctx, menuCode);
    return page ?? null;
  }
}
