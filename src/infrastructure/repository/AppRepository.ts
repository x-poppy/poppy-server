import { Inject, Provider } from '@augejs/core';
import { EntityManager, FindConditions, getRepository, Repository } from '@augejs/typeorm';
import { AppEntity, AppStatus } from '../../domain/model/AppEntity';
import { UniqueIdService } from '../service/UniqueIdService';

interface CreateOpt {
  appNo: string;
  orgNo: string | null;
  roleNo: string;
  parent: string | null;
  level: number;
  displayName: string;
  icon: string | null;
  desc: string | null;
}

interface ListOpts {
  offset: number;
  size: number;
  orgNo: string;
}

interface DeleteOpts {
  appNo: string;
}

@Provider()
export class AppRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  private appRepository: Repository<AppEntity> = getRepository(AppEntity);

  async findByStatusNormal(appNo: string): Promise<AppEntity | undefined> {
    return await this.appRepository.findOne(appNo.toString(), {
      where: {
        status: AppStatus.NORMAL,
      },
    });
  }

  async create(opts: CreateOpt, manager?: EntityManager): Promise<AppEntity> {
    const appRepository = manager?.getRepository(AppEntity) ?? this.appRepository;
    const app = new AppEntity();
    app.appNo = opts.appNo;
    app.orgNo = opts.orgNo;
    app.level = opts.level;
    app.parent = opts.parent;
    app.roleNo = opts.roleNo;
    app.icon = opts.icon;
    app.displayName = opts.displayName;
    app.desc = opts.desc;
    return appRepository.save(app);
  }

  find(appNo: string, opts?: FindConditions<AppEntity>): Promise<AppEntity | undefined> {
    return this.appRepository.findOne(appNo, {
      where: {
        ...opts,
      },
    });
  }

  async findRoot(): Promise<AppEntity | undefined> {
    return await this.appRepository.findOne({
      where: {
        orgNo: null,
      },
    });
  }

  async list(opts: ListOpts): Promise<[AppEntity[], number]> {
    return this.appRepository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        orgNo: opts.orgNo,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }

  async delete(opts: DeleteOpts): Promise<void> {
    await this.appRepository.delete(opts.appNo);
  }
}
