import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { AccessData } from '@augejs/koa-access-token/dist/AccessData';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { StepData } from '@augejs/koa-step-token';
import { SessionLoginDto } from '@/facade/dto/SessionDto';
import { AppService } from './AppService';
import { UserService } from './UserService';
import { RoleService } from './RoleService';
import { UserCredentialService } from './UserCredentialService';
import { TwoFactorAuthService } from './TwoFactorAuthService';
import { RolePermissionService } from './RolePermissionService';
import { CustomizedServiceService } from './CustomizedServiceService';
import { CustomizedServiceCode } from '../model/CustomizedServiceEntity';
import { UserStatus } from '../model/UserEntity';

@Provider()
export class SessionService {

  @GetLogger()
  private logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  private i18n!: I18n;

  @Inject(AppService)
  private appService!: AppService;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(CustomizedServiceService)
  private customizedServiceService!: CustomizedServiceService;

  @Inject(UserCredentialService)
  private userCredentialService!: UserCredentialService;

  @Inject(RoleService)
  private roleService!: RoleService;

  @Inject(TwoFactorAuthService)
  private twoFactorService!: TwoFactorAuthService;

  @Inject(RolePermissionService)
  private rolePermissionService!: RolePermissionService;

  async auth(ctx: KoaContext, appId: string, loginDto: SessionLoginDto): Promise<StepData> | never {
    this.logger.info(`auth start. appId: ${appId}} userName ${loginDto.userName}`);

    const app = await this.appService.findAndVerify(appId);
    const user = await this.userService.findAndVerify(appId, loginDto.userName);
    const userRole = await this.roleService.findAndVerify(appId, user.roleId);
    await this.userCredentialService.verifyPassword(user.id, loginDto.password);

    const twoFactorList = await this.twoFactorService.findTwoFactorList(user.id);
    const needTwoFactorAuth = twoFactorList.length > 0;

    const loginService = await this.customizedServiceService.findAndVerify(appId, CustomizedServiceCode.LOGIN, true);

    const stepData = ctx.createStepData('login');
    stepData.set('userId', user.id);
    stepData.set('accountName', loginDto.userName);
    stepData.set('userRoleId', userRole.id);
    stepData.set('userRoleLevel', userRole.level);
    stepData.set('appId', appId);
    stepData.set('appLevel', app.level);
    stepData.set('needTwoFactorAuth', needTwoFactorAuth);
    stepData.set('twoFactorAuthList', twoFactorList);
    stepData.set('sessionExpireTime', loginService?.extParams?.sessionExpireTime ?? '2h');
    stepData.set('maxOnlineUserCount', loginService?.extParams?.maxOnlineUserCount ?? 3);

    const twoFactorAuthSteps = [];
    if (needTwoFactorAuth) {
      twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    }
    stepData.steps = [...twoFactorAuthSteps, 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    this.logger.info(`auth end. appId: ${appId}} userName ${loginDto.userName}`);
    return stepData;
  }

  async kickOffOnlineUsers(context: KoaContext, userId: string, maxOnlineUserCount: number): Promise<void> {
    const accessDataList = await context.findAccessDataListByUserId(userId, {
      skipCount: maxOnlineUserCount - 1,
      incudesCurrent: false,
    });

    // after verify the pwd then kick the before session.
    for (const accessData of accessDataList) {
      accessData.isDeadNextTime = true;
      accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Login_Kick_User_Error }, { ip: context.ip });
      accessData.commit();
      await accessData.save();
    }
  }

  async kickOffAllOnlineUsers(context: KoaContext, userId: string): Promise<void> {
    const accessDataList = await context.findAccessDataListByUserId(userId, {
      skipCount: 0,
      incudesCurrent: true,
    });

    // after verify the pwd then kick the before session.
    for (const accessData of accessDataList) {
      accessData.isDeadNextTime = true;
      accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Login_Kick_User_Error }, { ip: context.ip });
      accessData.commit();
      await accessData.save();
    }
  }

  async kickOffAllOnlineRoleUsers(context: KoaContext, roleId: string): Promise<void> {
    const users = await this.userService.findAll({ roleId, status: UserStatus.NORMAL });
    for (const user of users) {
      const accessDataList = await context.findAccessDataListByUserId(user.id, {
        skipCount: 0,
        incudesCurrent: true,
      });

      // after verify the pwd then kick the before session.
      for (const accessData of accessDataList) {
        accessData.isDeadNextTime = true;
        accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Login_Kick_User_Error }, { ip: context.ip });
        accessData.commit();
        await accessData.save();
      }
    }
  }

  async createAccessData(ctx: KoaContext): Promise<AccessData> | never {
    const stepData = ctx.stepData as StepData;

    const userId = stepData.get<string>('userId');
    const accountName = stepData.get<string>('accountName');
    const userRoleId = stepData.get<string>('userRoleId');
    const userRoleLevel = stepData.get<number>('userRoleLevel');
    const appId = stepData.get<string>('appId');
    const appLevel = stepData.get<number>('appLevel');

    const sessionExpireTime = stepData.get<string>('sessionExpireTime') ?? '2h';
    const maxOnlineUserCount = stepData.get<number>('maxOnlineUserCount') ?? 1;

    this.logger.info(`createAccessData start. userId: ${userId}`);

    await this.kickOffOnlineUsers(ctx, userId, maxOnlineUserCount);

    const accessData = ctx.createAccessData(userId, sessionExpireTime);
    accessData.set('userId', userId);
    stepData.set('accountName', accountName);
    accessData.set('userRoleId', userRoleId);
    accessData.set('userRoleLevel', userRoleLevel);
    accessData.set('appId', appId);
    accessData.set('appLevel', appLevel);

    const userPermissions = await this.rolePermissionService.findPermissionsBoByRoleId(userRoleId);
    accessData.set('userPermissions', userPermissions.toJSON());

    await accessData.save();

    this.logger.info(`createAccessData end. userId: ${userId}`);

    return accessData;
  }
}
