import { RoleService } from '@/domain/service/RoleService';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

@Prefix('/api/v1/app/app-theme')
@Provider()
export class AppThemeController {
  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('offset') @RequestParams((value: string) => parseInt(value)) offset: number,
    @RequestParams.Query('size') @RequestParams((value: string) => parseInt(value)) size: number,
  ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    // const userOrgNo = accessData.get<string>('userOrgNo');
    // const appNo = accessData.get<string>('appNo');
    // const userRoleLevel = accessData.get<number>('userRoleLevel');
    // const [list, count] = await this.roleService.list({
    //   offset,
    //   size,
    //   appNo,
    //   orgNo: userOrgNo,
    //   roleLevel: userRoleLevel,
    // });
    return {
      list: [],
      count: 0,
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete(':key')
  async delete(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params('key') key: string): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo');
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
