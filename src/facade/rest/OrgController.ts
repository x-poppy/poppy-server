import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessTokenMiddleware } from '@augejs/koa-access-token';
import { OrgService } from '../../domain/service/OrgService';

@Prefix('/api/v1/org')
@Provider()
export class OrgController {
  @Inject(OrgService)
  private orgService!: OrgService;

  @AccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() context: KoaContext,
    @RequestParams.Query('offset') @RequestParams(parseInt) offset: number,
    @RequestParams.Query('size') @RequestParams(parseInt) size: number,
    ): Promise<Record<string, unknown>> {
    const parent = context.accessData?.get('orgNo') as string ?? null;
    const appNo = context.accessData?.get('appNo') as string ?? null;
    const [list, count] = await this.orgService.list({
      offset,
      size,
      appNo,
      parent,
    });
    return {
      list,
      count,
    };
  }

  // @AccessTokenMiddleware()
  // @RequestMapping.Post('/')
  // async create(
  //   @RequestParams.Context() context: KoaContext,
  // ) {
  //   const parent = context.accessData?.get('orgNo') as bigint;

  // }

  // @AccessTokenMiddleware()
  // @RequestMapping.Get('/:orgNo')
  // async find() {
  // }

  // @AccessTokenMiddleware()
  // @RequestMapping.Put('/:orgNo')
  // async update() {
  // }

  // @AccessTokenMiddleware()
  // @RequestMapping.Delete('/:orgNo')
  // async delete() {
  // }
}
