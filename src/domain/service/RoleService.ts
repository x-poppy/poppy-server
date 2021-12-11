import { RoleCreateDto } from '@/facade/dto/RoleDto';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PPAccessData } from '@/types/PPAccessData';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { EntityManager, Transaction, TransactionManager } from '@augejs/typeorm';
import { RoleEntity, RoleStatus } from '../model/RoleEntity';
import { PPService } from './PPService';

@Provider()
export class RoleService extends PPService<RoleEntity,RoleRepository> {

  @GetLogger()
  private readonly logger!: ILogger;

  @Inject(RoleRepository)
  protected override repository!: RoleRepository;

  @Inject(UserRepository)
  private readonly userRepository!: UserRepository;


  async findAndVerify(appId: string, roleId: string): Promise<RoleEntity> | never {
    const role = await this.repository.findOne({ id: roleId, appId }, { select: ['id', 'status', 'level'] });
    if (!role) {
      this.logger.info(`Role_Is_Not_Exist. roleId: ${roleId} appId: ${appId}`);
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    if (role.status === RoleStatus.DISABLED) {
      this.logger.warn(`Role_Status_Is_Disabled. roleId: ${roleId} appId: ${appId}`);
      throw new BusinessError(I18nMessageKeys.Role_Status_Is_Disabled);
    }

    if (role.status !== RoleStatus.NORMAL) {
      this.logger.warn(`Role_Status_Is_Not_Normal. roleId: ${roleId} appId: ${appId}`);
      throw new BusinessError(I18nMessageKeys.Role_Status_Is_Not_Normal);
    }

    return role;
  }

  async checkRoleIsUsed(roleId: string, appId: string): Promise<boolean> {
    const usedCount = await this.repository.count({ appId, id: roleId });
    return usedCount > 0;
  }

  async createRole(dto: RoleCreateDto, accessData: PPAccessData,  @TransactionManager() manager: EntityManager): Promise<RoleEntity> {
    const appId = accessData.get<string>('appId');
    const appLevel = accessData.get<number>('appLevel');
    const userRoleId = accessData.get<string>('userRoleId');
    const userRoleLevel = accessData.get<number>('userRoleLevel');

    const role: RoleEntity = await this.create({
      level: userRoleLevel + 1,
      parent: userRoleId,
      appId,
      appLevel,
      title: dto.title,
    }, manager);

    return role;
  }

  @Transaction()
  async deleteRole(roleId: string, appId: string, @TransactionManager() manager: EntityManager): Promise<void> {
    const roleUsedCount = await this.userRepository.count({ roleId, appId });
    if (roleUsedCount > 0) {
      throw new Error('1111');
    }

    await this.delete({id: roleId, appId,}, manager);
  }
}
