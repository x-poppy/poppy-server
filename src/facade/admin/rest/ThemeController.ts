import { Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';

import { ThemeService } from '@/domain/service/ThemeService';
import { RequestValidator } from '@/util/decorator/RequestValidatorDecorator';
import { CreateThemeDto, DeleteThemeDto, ListThemeDto, ThemeBundleDto, UpdateThemeDto } from '../dto/ThemeDto';
import { PoppyAccessData } from '@/types/PoppyAccessData';
import { ThemeEntity } from '@/domain/model/ThemeEntity';

@Prefix('/api/v1/theme')
@Provider()
export class ThemeController {
  @Inject(ThemeService)
  private themeService!: ThemeService;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('/theme')
  async create(@RequestParams.Context() ctx: KoaContext, @RequestParams.Body() @RequestValidator(CreateThemeDto) dto: CreateThemeDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');

    await this.themeService.create({
      appNo,
      ...dto,
    });

    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Put('/theme/:id')
  async update(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Params('id') id: string,
    @RequestParams.Params() @RequestValidator(UpdateThemeDto) dto: UpdateThemeDto,
  ): Promise<void> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');
    await this.themeService.update({
      id,
      appNo,
      ...dto,
    });
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/theme/list')
  async list(@RequestParams.Context() ctx: KoaContext, @RequestParams.Query() @RequestValidator(ListThemeDto) dto: ListThemeDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');

    const [list, count] = await this.themeService.list({
      appNo,
      ...dto,
    });

    return {
      list,
      count,
    };
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('/theme/:id')
  async delete(@RequestParams.Context() ctx: KoaContext, @RequestParams.Params() @RequestValidator(DeleteThemeDto) dto: DeleteThemeDto): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as PoppyAccessData;
    const appNo = accessData.get<string>('appNo');

    await this.themeService.delete({
      appNo,
      ...dto,
    });

    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('/theme-bundle')
  async themeBundle(@RequestParams.Query() @RequestValidator(ThemeBundleDto) dto: ThemeBundleDto): Promise<Record<string, string>> {
    const results = await this.themeService.all(dto);
    return results.reduce((map: Record<string, string>, current: ThemeEntity) => {
      map[current.key] = current.value ?? '';
      return map;
    }, {});
  }
}
