import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';

import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { AppDO, AppStatus } from '../model/AppDO';
import { PPService } from './PPService';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { BusinessError } from '@/util/BusinessError';
import { EntityManager, Transaction, TransactionManager } from '@augejs/typeorm';
import { AppCreateDTO } from '@/facade/dto/AppDTO';
import { PPAccessData } from '@/types/PPAccessData';
import { UserService } from './UserService';
import { RoleService } from './RoleService';
import { CustomizedServiceService } from './CustomizedServiceService';
import { I18nService } from './I18nService';
import { MenuService } from './MenuService';
import { ThemeService } from './ThemeService';
import { OperationLogService } from './OperationLogService';
import { AppLangService } from './AppLangService';
import { RolePermissionService } from './RolePermissionService';
import { AppDomainService } from './AppDomainService';
import { UserCredentialService } from './UserCredentialService';

@Provider()
export class AppService extends PPService <AppDO, AppRepository>{

  @GetLogger()
  private readonly logger!: ILogger;

  @Inject(AppRepository)
  protected override readonly repository!: AppRepository;

  @Inject(UserService)
  private readonly userService!: UserService;

  @Inject(UserCredentialService)
  private readonly userCredentialService!: UserCredentialService;

  @Inject(RoleService)
  private readonly roleService!: RoleService;

  @Inject(CustomizedServiceService)
  private readonly customizedServiceService!: CustomizedServiceService;

  @Inject(I18nService)
  private readonly i18nService!: I18nService;

  @Inject(MenuService)
  private readonly menuService!: MenuService;

  @Inject(ThemeService)
  private readonly themeService!: ThemeService;

  @Inject(OperationLogService)
  private readonly operationLogService!: OperationLogService;

  @Inject(AppLangService)
  private readonly appLangService!: AppLangService;

  @Inject(RolePermissionService)
  private readonly rolePermissionService!: RolePermissionService;

  @Inject(AppDomainService)
  private readonly appDomainService!: AppDomainService;

  async findAndVerify(id: string): Promise<AppDO> | never {
    const app = await this.repository.findOne({ id }, { select: ['level', 'status', 'expireAt'] });
    if (!app) {
      this.logger.info(`App_Is_Not_Exist. appId: ${id}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    if (app.status === AppStatus.DISABLED) {
      this.logger.warn(`App_Status_Is_Disabled. appId: ${id}`);
      throw new BusinessError(I18nMessageKeys.App_Status_Is_Disabled);
    }

    if (app.status !== AppStatus.NORMAL) {
      this.logger.warn(`App_Status_Is_Disabled. appId: ${id}`);
      throw new BusinessError(I18nMessageKeys.App_Status_Is_Not_Normal);
    }

    if (app.isExpired) {
      this.logger.warn(`App_isExpired. appId: ${id}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Expired);
    }

    return app;
  }

  @Transaction()
  async createApp (
    dto: AppCreateDTO,
    accessData: PPAccessData,
    @TransactionManager() manager: EntityManager): Promise<AppDO> {
    const appId = accessData.get<string>('appId');
    const appLevel = accessData.get<number>('appLevel');
    const userRoleId = accessData.get<string>('userRoleId');
    const userRoleLevel = accessData.get<number>('userRoleLevel');

    // create appRole, user, adminRole
    const app = await this.repository.create({
      title: dto.title,
      logoImg: dto.logoImg,
      parent: appId,
      level: appLevel + 1
    }, manager);

    const role = await this.roleService.create({
      appId: app.id,
      title: 'admin',
      appLevel: app.level,
      parent: userRoleId,
      level: userRoleLevel + 1,
    }, manager);

    this.userService.createUserByAppDto(dto, app, role, manager);

    return app;
  }

  @Transaction()
  async deleteApp(appId: string, @TransactionManager() manager: EntityManager): Promise<void> {
    await this.repository.delete(appId, manager);
    await this.userService.delete(appId, manager);
    await this.userCredentialService.delete({ appId }, manager);
    await this.roleService.delete({ appId }, manager);
    await this.customizedServiceService.delete({ appId }, manager);
    await this.i18nService.delete({ appId }, manager);
    await this.menuService.delete({ appId }, manager);
    await this.themeService.delete({ appId }, manager);
    await this.operationLogService.delete({ appId }, manager);
    await this.appLangService.delete({ appId }, manager);
    await this.rolePermissionService.delete({ appId }, manager);
    await this.appDomainService.delete({ appId }, manager);
  }
}
