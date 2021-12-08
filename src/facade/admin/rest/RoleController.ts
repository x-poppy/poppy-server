import { RoleService } from '@/domain/service/RoleService';
import { PoppyAccessData } from '@/types/PoppyAccessData';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/role/role')
@Provider()
export class RoleController {
  @Inject(RoleService)
  roleService!: RoleService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('offset') @RequestParams((value: string) => parseInt(value)) offset: number,
    @RequestParams.Query('size') @RequestParams((value: string) => parseInt(value)) size: number,
  ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');
    const userRoleLevel = accessData.get<number>('userRoleLevel');

    const [list, count] = await this.roleService.list({
      offset,
      size,
      appNo,
      roleLevel: userRoleLevel,
    });
    return {
      list,
      count,
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete(':roleNo')
  async delete(@RequestParams.Params('roleNo') roleNo: string): Promise<Record<string, unknown>> {
    await this.roleService.delete(roleNo);
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(): Promise<Record<string, unknown>> {
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('')
  async update(): Promise<Record<string, unknown>> {
    return {};
  }
}
