import { AppLangDO } from '@/domain/model/AppLangDO';
import { LangDO } from '@/domain/model/LangDO';
import { FindAllOpt } from '@/types/FindAllOpt';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { Provider } from '@augejs/core';
import { PPRepository } from './PPRepository';

@Provider()
export class AppLangRepository extends PPRepository<AppLangDO> {

  constructor() {
    super(AppLangDO);
  }

  override async findAll(condition: FindDeepPartial<AppLangDO>): Promise<AppLangDO[]> {
    const repository = this.getRepository();
    const results = await repository
      .createQueryBuilder('appLang')
      .select(['appLang.*, lang.name, lang.icon'])
      .innerJoin(LangDO, 'lang', 'lang.locale = appLang.locale')
      .where('appLang.appId = :appId', { appId: condition.appId })
      .getRawMany();

      return results.map(item => {
        const appLang = repository.create(item as Partial<AppLangDO>);
        appLang.name = item.name;
        appLang.icon = item.icon;
        return appLang;
      });
  }
}
