import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';

import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { LoginDto } from '@/facade/dto/LoginDto';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';

import { UserStatus } from '../model/UserEntity';
import { BusinessError } from '../../util/BusinessError';

import { AppDomainRepository } from '@/infrastructure/repository/AppDomainRepository';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { UserRepository } from '@/infrastructure/repository/UserRepository';
import { PasswordService } from '@/infrastructure/service/PasswordService';

import { RolePermissionService } from './RolePermissionService';
import { SessionData } from '@augejs/koa-session-token';

@Provider()
export class AuthService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(AppDomainRepository)
  private appDomainRepository!: AppDomainRepository;

  @Inject(AppRepository)
  private appRepository!: AppRepository;

  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(RolePermissionService)
  rolePermissionService!: RolePermissionService;

  @Inject(RoleRepository)
  roleRepository!: RoleRepository;

  @Inject(OrgRepository)
  orgRepository!: OrgRepository;

  async auth(ctx: KoaContext, loginDto: LoginDto): Promise<SessionData> {
    this.logger.info(`auth start. userName ${loginDto.userName} domain: ${loginDto.domain}`);

    const appDomain = await this.appDomainRepository.findByStatusNormal(loginDto.domain);
    if (!appDomain) {
      this.logger.info(`Domain_Is_Not_Exist. ${loginDto.domain}`);
      throw new BusinessError(I18nMessageKeys.Domain_Is_Not_Exist);
    }

    const app = await this.appRepository.findByStatusNormal(appDomain.appNo);
    if (!app) {
      this.logger.info(`App_Is_Not_Exist. appNo: ${appDomain.appNo}`);
      throw new BusinessError(I18nMessageKeys.App_Is_Not_Exist);
    }

    const isTopApp = !app.parent;
    const appOrg = isTopApp ? null : await this.orgRepository.findByStatusNormal(app.orgNo as string);
    if (!isTopApp && !appOrg) {
      this.logger.warn(`App_Is_Not_Exist. appOrgNo: ${app.orgNo}`);
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const user = await this.userRepository.findByAccountNameAndAppNo(loginDto.userName, appDomain.appNo);
    if (!user) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${appDomain.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Is_Not_Exist);
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${appDomain.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    if (user.status === UserStatus.LOCKED) {
      this.logger.warn(`User_Is_Locked. userName: ${loginDto.userName} appNo: ${appDomain.appNo}`);
      throw new BusinessError(I18nMessageKeys.User_Status_Is_Disabled);
    }

    const userOrg = await this.orgRepository.findByStatusNormal(user.orgNo);
    if (!userOrg) {
      this.logger.warn(`User_Is_Not_Exist. userName: ${loginDto.userName} appNo: ${appDomain.appNo}`);
      throw new BusinessError(I18nMessageKeys.Org_Is_Not_Exist);
    }

    const userRole = await this.roleRepository.findByStatusNormal(user.roleNo);
    if (!userRole) {
      this.logger.warn(`Role_Is_Not_Exist. roleNo: ${user.roleNo}`);
      throw new BusinessError(I18nMessageKeys.Role_Is_Not_Exist);
    }

    const verifyPwdResult = await this.passwordService.verifyPwd(user.userNo, user.nonce, loginDto.password, user.passwd);
    if (!verifyPwdResult) {
      this.logger.warn(`User_Name_Or_Password_Is_InCorrect. userName: ${loginDto.userName}`);
      throw new BusinessError(I18nMessageKeys.User_Name_Or_Password_Is_InCorrect);
    }

    const sessionData = ctx.createSessionData('login');
    sessionData.set('userNo', user.userNo);
    sessionData.set('userRoleNo', userRole.roleNo);
    sessionData.set('userOrgNo', user.orgNo);
    sessionData.set('appNo', app.appNo);
    sessionData.set('appOrgNo', app.orgNo);
    sessionData.commit();
    await sessionData.save();

    this.logger.info(`auth end. userName ${loginDto.userName} domain: ${loginDto.domain}`);

    return sessionData;
  }
}
