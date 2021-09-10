import { AppConfigEntity, AppConfigStatus, AppConfigUIType } from '@/domain/model/AppConfigEntity';
import { Provider } from '@augejs/core';
import { EntityManager, getRepository, Repository } from '@augejs/typeorm';

interface CreateOpt {
  key: string;
  appNo: string;
  displayName: string;
  uiType: AppConfigUIType;
  desc?: string | null;
}

interface ListOpts {
  appNo: string;
}

interface FindOpts {
  key: string;
  appNo: string;
}
@Provider()
export class AppConfigRepository {
  private appRepository: Repository<AppConfigEntity> = getRepository(AppConfigEntity);

  async create(opts: CreateOpt, manager?: EntityManager): Promise<AppConfigEntity> {
    const appRepository = manager?.getRepository(AppConfigEntity) ?? this.appRepository;
    const app = new AppConfigEntity();
    app.appNo = opts.appNo;
    app.uiType = opts.uiType;
    app.desc = opts.desc ?? null;
    return appRepository.save(app);
  }

  async list(opts: ListOpts): Promise<AppConfigEntity[]> {
    const results = await this.appRepository.find({
      where: {
        appNo: opts.appNo,
        status: AppConfigStatus.NORMAL,
      },
    });

    return results;
  }

  async findByStatusNormal(opts: FindOpts): Promise<AppConfigEntity | undefined> {
    const results = await this.appRepository.findOne({
      where: {
        key: opts.key,
        appNo: opts.appNo,
        status: AppConfigStatus.NORMAL,
      },
    });

    return results;
  }

  async findValueByStatusNormal(appNo: string, key: string): Promise<string | undefined> {
    const result = await this.appRepository.findOne({
      where: {
        key: key,
        appNo: appNo,
        status: AppConfigStatus.NORMAL,
      },
      select: ['value'],
    });
    return result?.value;
  }
}
