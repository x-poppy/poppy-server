import { Inject, Provider } from '@augejs/core';
import { EntityManager, getRepository, Repository } from '@augejs/typeorm';
import { OrgEntity, OrgStatus } from '../../domain/model/OrgEntity';
import { SnowflakeService } from '../service/SnowflakeService';

interface CreateOpt {
  parent: string | null
  appNo: string
  level: number
  displayName: string
  desc: string | null
}

interface ListOpts {
  offset: number
  size: number
  appNo: string
  parent?: string | null
}

@Provider()
export class OrgRepository {
  @Inject(SnowflakeService)
  private snowflakeService!: SnowflakeService;

  orgRepository: Repository<OrgEntity> = getRepository(OrgEntity);

  async list(opts: ListOpts): Promise<[OrgEntity[], number]> {
    return this.orgRepository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,
        parent: opts.parent,
      },
      order: {
        createAt: 'DESC',
      },
    });
  }

  async findByStatusNormal(orgNo: string): Promise<OrgEntity | undefined> {
    return await this.orgRepository.findOne(orgNo, {
      where: {
        status: OrgStatus.NORMAL,
      },
    });
  }

  async findRoot(): Promise<OrgEntity | undefined> {
    return await this.orgRepository.findOne({
      where: {
        parent: null,
      },
    });
  }

  async create(opts: CreateOpt, manager?: EntityManager): Promise<OrgEntity> {
    const orgRepository = manager?.getRepository(OrgEntity) ?? this.orgRepository;

    const orgNo = await this.snowflakeService.getUniqueId();
    const org = new OrgEntity();
    org.orgNo = orgNo;
    org.appNo = opts.appNo;
    org.parent = opts.parent;
    org.level = opts.level;
    org.displayName = opts.displayName;
    org.desc = opts.desc;

    return orgRepository.save(org);
  }
}
