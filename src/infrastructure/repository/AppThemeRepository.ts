import { AppThemeEntity, AppThemeStatus } from '@/domain/model/AppThemeEntity';
import { Provider } from '@augejs/core';
import { getRepository, Repository } from '@augejs/typeorm';

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
}

@Provider()
export class AppThemeRepository {
  private appThemeRepository: Repository<AppThemeEntity> = getRepository(AppThemeEntity);

  async listAllByNormalStatus(appNo: string): Promise<AppThemeEntity[]> {
    return this.appThemeRepository.find({
      where: {
        appNo,
        status: AppThemeStatus.NORMAL,
      },
    });
  }

  async list(opts: ListOpts): Promise<[AppThemeEntity[], number]> {
    return this.appThemeRepository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }
}
