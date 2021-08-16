import { AppThemeEntity, AppThemeStatus } from '@/domain/model/AppThemeEntity';
import { Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';

interface ListOpts {
  appNo: string;
}

@Provider()
export class AppThemeRepository {
  private appThemeRepository: Repository<AppThemeEntity> = getRepository(AppThemeEntity);

  async listAllByNormalStatus(opts: ListOpts): Promise<AppThemeEntity[]> {
    return this.appThemeRepository.find({
      where: {
        appNo: opts.appNo,
        status: AppThemeStatus.NORMAL,
      },
    });
  }
}
