import { Provider } from '@augejs/core';
import { EntityManager, FindConditions, getRepository, Repository } from '@augejs/typeorm';
import { AppDomainEntity, AppDomainStatus } from '../../domain/model/AppDomainEntity';

interface CreateOpts {
  appNo: string;
  domain: string;
}

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
}

@Provider()
export class AppDomainRepository {
  private appDomainRepository: Repository<AppDomainEntity> = getRepository(AppDomainEntity);

  async create(opts: CreateOpts, manager?: EntityManager): Promise<AppDomainEntity> {
    const appDomainRepository = manager?.getRepository(AppDomainEntity) ?? this.appDomainRepository;
    const appDomain = new AppDomainEntity();
    appDomain.domain = opts.domain;
    appDomain.appNo = opts.appNo;
    await appDomainRepository.save(appDomain);
    return appDomain;
  }

  async list(opts: ListOpts): Promise<[AppDomainEntity[], number]> {
    return this.appDomainRepository.findAndCount({
      where: {
        skip: opts.offset,
        take: opts.size,
        appNo: opts.appNo,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }

  find(domain: string, opts?: FindConditions<AppDomainEntity>): Promise<AppDomainEntity | undefined> {
    return this.appDomainRepository.findOne(domain, {
      where: {
        ...opts,
      },
    });
  }

  async findByStatusNormal(domain: string): Promise<AppDomainEntity | undefined> {
    return await this.appDomainRepository.findOne(domain, {
      where: {
        status: AppDomainStatus.NORMAL,
      },
    });
  }

  async findAppDomainAddressByAppNo(appNo: string): Promise<string | undefined> {
    const appDomain = await this.appDomainRepository.findOne({
      where: {
        appNo,
        status: AppDomainStatus.NORMAL,
      },
    });

    if (!appDomain) return undefined;

    return appDomain.domain;
  }
}
