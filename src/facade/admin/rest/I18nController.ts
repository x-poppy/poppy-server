import { I18nEntity } from '@/domain/model/18nEntity';
import { I18nService } from '@/domain/service/I18nService';
import { PoppyAccessData } from '@/types/PoppyAccessData';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { CreateI18nDto, DeleteI18nDto, MessageBundleDto, ListI18nDto, UpdateI18nDto } from '../dto/I18nDto';

@Provider()
@Prefix('/api/v1/i18n')
export class I18nController {
  @Inject(I18nService)
  private i18nService!: I18nService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('/i18n')
  async create(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body() @RequestValidator(CreateI18nDto) dto: CreateI18nDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');

    await this.i18nService.create({
      appNo,
      ...dto,
    });

    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('/i18n/:id')
  async update(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params() @RequestValidator(UpdateI18nDto) dto: UpdateI18nDto): Promise<void> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');
    await this.i18nService.update({
      appNo,
      ...dto,
    });
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/i18n/list')
  async list(@RequestParams.Context() ctx: KoaContext, @RequestParams.Query() @RequestValidator(ListI18nDto) dto: ListI18nDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');
    const [list, count] = await this.i18nService.list({
      appNo,
      ...dto,
    });

    return {
      list,
      count,
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/i18n/:id')
  async delete(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params() @RequestValidator(DeleteI18nDto) dto: DeleteI18nDto): Promise<void> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');
    await this.i18nService.delete({
      appNo,
      ...dto,
    });
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/message-bundle')
  async messageBundle(@RequestParams.Query() @RequestValidator(MessageBundleDto) dto: MessageBundleDto): Promise<Record<string, string>> {
    const results = await this.i18nService.all(dto);
    return results.reduce((map: Record<string, string>, current: I18nEntity) => {
      map[current.key] = current.value ?? '';
      return map;
    }, {});
  }
}
