import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { OrgService } from '../../domain/service/OrgService';
import { CreateOrgDto } from '../dto/CreateOrgDto';

@Prefix('/api/v1/org')
@Provider()
export class OrgController {
  @Inject(OrgService)
  private orgService!: OrgService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('offset') @RequestParams((value: string) => parseInt(value)) offset: number,
    @RequestParams.Query('size') @RequestParams((value: string) => parseInt(value)) size: number,
  ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const parent = accessData.get<string>('orgNo') ?? null;
    const appNo = accessData.get<string>('appNo') ?? null;

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

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('/')
  async create(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body() @RequestValidator(CreateOrgDto) createOrgDto: CreateOrgDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo');

    await this.orgService.create({
      appNo,
      orgDisplayName: createOrgDto.orgDisplayName,
      userAccountName: createOrgDto.userAccountName,
      roleDisplayName: 'Admin',
    });
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('/:orgNo')
  async update(): Promise<Record<string, unknown>> {
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/:orgNo')
  async delete(@RequestParams.Params('orgNo') orgNo: string): Promise<Record<string, unknown>> {
    return {};
  }
}
