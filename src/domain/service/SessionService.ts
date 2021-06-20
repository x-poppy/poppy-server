import { Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { AccessData } from '@augejs/koa-access-token/dist/AccessData';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';

import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { LoginDto } from '@/facade/dto/LoginDto';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';

import { UserStatus } from '../model/UserEntity';
import { BusinessError } from '../exception/BusinessError';

import { AppConfigKeys } from '@/util/AppConfigKeys';
import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';

import { AppConfigService } from './AppConfigService';
import { RolePermissionService } from './RolePermissionService';

@Provider()
export class SessionService {
  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(AppDomainRepository)
  private appDomainRepository!: AppDomainRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(AppConfigService)
  private appConfigService!: AppConfigService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(RolePermissionService)
  rolePermissionService!: RolePermissionService;

  @Inject(RoleRepository)
  roleRepository!: RoleRepository;

  @Inject(OrgRepository)
  orgRepository!: OrgRepository;

  private async findAndValidate(loginDto: LoginDto) {
    const appDomain = await this.appDomainRepository.findByStatusNormal(loginDto.domain);
    if (!appDomain) {
      throw new BusinessError(I18nMessageKeys.Domain_Is_Not_Exist);
    }

    const app = await this.appRepository.findByStatusNormal(appDomain.appNo);
    if (!app) {
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const isTopApp = app.isTop;
    const appOrg = isTopApp ? null : await this.orgRepository.findByStatusNormal(app.orgNo as string);
    if (!isTopApp && !appOrg) {
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const user = await this.userRepository.findByAccountNameAndAppNo(loginDto.userName, appDomain.appNo);
    if (!user) {
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.LOCKED) {
      throw new BusinessError(I18nMessageKeys.User_Is_Locked);
    }

    const userOrg = await this.orgRepository.findByStatusNormal(user.orgNo);
    if (!userOrg) {
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const userRole = await this.roleRepository.findByStatusNormal(user.roleNo);
    if (!userRole) {
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    if (!this.passwordService.verifyPwd(user.userNo, user.nonce, loginDto.password, user.passwd)) {
      // here we need
      throw new BusinessError(I18nMessageKeys.User_Name_Or_Password_Is_InCorrect);
    }

    return {
      app,
      user,
      appOrg,
      userRole,
      userOrg,
    };
  }

  async kickOffOnlineUsers(context: KoaContext, userNo: string): Promise<void> {
    const maxOnlineUserCountStr = (await this.appConfigService.get(AppConfigKeys.Max_Online_User_Count)) ?? '';
    const maxOnlineUserCount = parseInt(maxOnlineUserCountStr) || 2;
    const accessDataList = await context.findAccessDataListByUserId(userNo.toString(), {
      skipCount: maxOnlineUserCount - 1,
    });
    // after verify the pwd then kick the before session.
    for (const accessData of accessDataList) {
      accessData.isDeadNextTime = true;
      accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Kick_Before_User_After_New_Login }, { ip: context.ip });
      accessData.commit();
      await accessData.save();
    }
  }

  async createAccessData(context: KoaContext, loginDto: LoginDto): Promise<AccessData> | never {
    const { app, user, userRole } = await this.findAndValidate(loginDto);

    const userPermissions = await this.rolePermissionService.findPermissionsByRoleNo(userRole.roleNo);

    await this.kickOffOnlineUsers(context, user.userNo);

    const accessData = context.createAccessData(user.userNo.toString());

    accessData.set('userNo', user.userNo);
    accessData.set('userRoleNo', userRole.roleNo);
    accessData.set('userOrgNo', user.orgNo);
    accessData.set('appNo', app.appNo);
    accessData.set('appOrgNo', app.orgNo);
    accessData.set('userPermissions', userPermissions);
    return accessData;
  }
}
