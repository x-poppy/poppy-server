import { MenuStatus } from '@/domain/model/MenuEntity';
import { RoleEntity } from '@/domain/model/RoleEntity';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, getRepository, LessThanOrEqual, Repository } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';

interface CreateOpt {
  parent: string | null;
  appNo: string;
  orgNo: string | null;
  level: number;
  inherited: boolean;
  displayName: string;
  desc: string | null;
  hasAppResPerms?: boolean;
}

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
  level: number;
  orgNo: string;
}

@Provider()
export class RoleRepository {
  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  private roleRepository: Repository<RoleEntity> = getRepository(RoleEntity);

  async create(opts: CreateOpt, manager?: EntityManager): Promise<RoleEntity> {
    const roleRepository = manager?.getRepository(RoleEntity) ?? this.roleRepository;

    const roleNo = await this.uniqueIdService.getUniqueId();
    const role = new RoleEntity();
    role.roleNo = roleNo;
    role.orgNo = opts.orgNo;
    role.parent = opts.parent;
    role.level = opts.level;
    role.inherited = opts.inherited;
    role.appNo = opts.appNo;
    role.displayName = opts.displayName;
    role.hasAppResPerms = opts.hasAppResPerms ?? false;
    role.desc = opts.desc;
    return roleRepository.save(role);
  }

  async findByStatusNormal(roleNo: string): Promise<RoleEntity | undefined> {
    return await this.roleRepository.findOne(roleNo, {
      where: {
        status: MenuStatus.NORMAL,
      },
    });
  }

  async list(opts: ListOpts): Promise<[RoleEntity[], number]> {
    return this.roleRepository.findAndCount({
      skip: opts.offset,
      take: opts.size,
      where: {
        appNo: opts.appNo,
        orgNo: opts.orgNo,
        level: LessThanOrEqual(opts.level),
      },
      order: {
        createAt: 'DESC',
      },
    });
  }

  async delete(roleNo: string): Promise<void> {
    await this.roleRepository.delete(roleNo);
  }
}
