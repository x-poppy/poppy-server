import { AppLangEntity } from '@/domain/model/AppLangEntity';
import { LangEntity } from '@/domain/model/LangEntity';
import { FindAllOpt } from '@/types/FindAllOpt';
import { FindDeepPartial } from '@/types/FindDeepPartial';
import { Provider } from '@augejs/core';
import { PPRepository } from './PPRepository';

@Provider()
export class AppLangRepository extends PPRepository<AppLangEntity> {

  constructor() {
    super(AppLangEntity);
  }

  override async findAll(condition: FindDeepPartial<AppLangEntity>, opts?: FindAllOpt): Promise<AppLangEntity[]> {
    const repository = this.getRepository();
    const results = await repository
      .createQueryBuilder('appLang')
      .select(['appLang.*, lang.name, lang.icon'])
      .innerJoin(LangEntity, 'lang', 'lang.locale = appLang.locale')
      .where('appLang.appId = :appId', { appId: condition.appId })
      .getRawMany();

      return results.map(item => {
        const appLang = repository.create(item as Partial<AppLangEntity>);
        appLang.name = item.name;
        appLang.icon = item.icon;
        return appLang;
      });
  }
}
