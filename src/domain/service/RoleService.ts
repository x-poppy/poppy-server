import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { Inject, Provider } from '@augejs/core';
import { RoleEntity } from '../model/RoleEntity';

interface ListOpts {
  offset: number;
  size: number;
  appNo: string;
  roleLevel: number;
  orgNo: string;
}

@Provider()
export class RoleService {
  @Inject(RoleRepository)
  private roleRepository!: RoleRepository;

  async list(opts: ListOpts): Promise<[RoleEntity[], number]> {
    return this.roleRepository.list({
      offset: opts.offset,
      size: opts.size,
      appNo: opts.appNo,
      level: opts.roleLevel,
      orgNo: opts.orgNo,
    });
  }

  async delete(roleNo: string): Promise<void> {
    this.roleRepository.delete(roleNo);
  }
}
