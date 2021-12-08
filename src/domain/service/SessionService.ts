import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { AccessData } from '@augejs/koa-access-token/dist/AccessData';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';

import { I18nMessageKeys } from '@/util/I18nMessageKeys';

import { AppConfigService } from './AppConfigService';
import { RolePermissionService } from './RolePermissionService';
import { StepData } from '@augejs/koa-step-token';
import { TwoFactorListBo } from '../bo/TwoFactorListBo';
import { ClientValidationError } from '@/util/BusinessError';
import { LoginDto } from '@/facade/admin/dto/LoginDto';
import { PasswordService } from '@/infrastructure/service/PasswordService';
import { UserService } from './UserService';

@Provider()
export class SessionService {
  @GetLogger()
  private logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  private i18n!: I18n;

  @Inject(AppConfigService)
  private appConfigService!: AppConfigService;

  @Inject(PasswordService)
  private passwordService!: PasswordService;

  @Inject(UserService)
  private userService!: UserService;

  @Inject(RolePermissionService)
  rolePermissionService!: RolePermissionService;

  async auth(ctx: KoaContext, loginDto: LoginDto): Promise<StepData> {
    this.logger.info(`auth start. userName ${loginDto.userName} appNo: ${loginDto.appNo}`);

    const { app, user, userRole } = await this.userService.findAndVerifyLoginUser(loginDto);

    const verifyPwdResult = await this.passwordService.verify(user.userNo, user.nonce, loginDto.password, user.passwd);
    if (!verifyPwdResult) {
      // here is punish mechanism here for test the passwd.
      this.logger.warn(`User_Name_Or_Password_Is_InCorrect. userName: ${loginDto.userName}`);
      throw new ClientValidationError(I18nMessageKeys.User_Name_Or_Password_Is_InCorrect);
    }

    const twoFactorList = TwoFactorListBo.createFromUser(user);
    const needTwoFactorAuth = user.twoFactorAuth && twoFactorList.length > 0;

    const stepData = ctx.createStepData('login');
    stepData.set('userNo', user.userNo);
    stepData.set('accountName', user.accountName);

    stepData.set('userRoleNo', userRole.roleNo);
    stepData.set('userRoleLevel', userRole.level);

    stepData.set('appNo', app.appNo);
    stepData.set('appLevel', app.level);

    stepData.set('twoFactorAuth', needTwoFactorAuth);

    const twoFactorAuthSteps = [];
    if (needTwoFactorAuth) {
      stepData.set('twoFactorAuthList', twoFactorList);
      twoFactorAuthSteps.push('twoFactorList', 'twoFactorAuth');
    }
    stepData.steps = [...twoFactorAuthSteps, 'end'].filter(Boolean) as string[];
    stepData.commit();
    await stepData.save();

    this.logger.info(`auth end. userName ${loginDto.userName} appNo: ${loginDto.appNo}`);

    return stepData;
  }

  async kickOffOnlineUsers(context: KoaContext, userNo: string, userAppNo: string): Promise<void> {
    const maxOnlineUserCount = await this.appConfigService.getMaxOnlineUserCount(userAppNo);
    const accessDataList = await context.findAccessDataListByUserId(userNo, {
      skipCount: maxOnlineUserCount - 1,
      incudesCurrent: false,
    });

    // after verify the pwd then kick the before session.
    for (const accessData of accessDataList) {
      accessData.isDeadNextTime = true;
      accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Kick_Before_User_After_New_Login }, { ip: context.ip });
      accessData.commit();
      await accessData.save();
    }
  }

  async kickOffAllOnlineUsers(context: KoaContext, userNo: string): Promise<void> {
    const accessDataList = await context.findAccessDataListByUserId(userNo, {
      skipCount: 0,
      incudesCurrent: true,
    });

    // after verify the pwd then kick the before session.
    for (const accessData of accessDataList) {
      accessData.isDeadNextTime = true;
      accessData.flashMessage = this.i18n.formatMessage({ id: I18nMessageKeys.Kick_Before_User_After_New_Login }, { ip: context.ip });
      accessData.commit();
      await accessData.save();
    }
  }

  async createAccessData(ctx: KoaContext): Promise<AccessData> | never {
    const stepData = ctx.stepData as StepData;

    const userNo = stepData.get<string>('userNo');
    const accountName = stepData.get<string>('accountName');
    const userRoleNo = stepData.get<string>('userRoleNo');
    const userRoleLevel = stepData.get('userRoleLevel');

    const appNo = stepData.get<string>('appNo');
    const appLevel = stepData.get('appLevel');

    this.logger.info(`createAccessData start. userNo: ${userNo}`);

    await this.kickOffOnlineUsers(ctx, userNo, appNo);

    const userPermissions = await this.rolePermissionService.findPermissionsByRoleNo(userRoleNo);

    const accessData = ctx.createAccessData(userNo, process.env.NODE_ENV !== 'production' ? '2h' : undefined);

    accessData.set('userNo', userNo);
    stepData.set('accountName', accountName);

    accessData.set('userRoleNo', userRoleNo);
    accessData.set('userRoleLevel', userRoleLevel);

    accessData.set('appNo', appNo);
    accessData.set('appLevel', appLevel);
    accessData.set('userPermissions', userPermissions.toJson());

    await accessData.save();

    this.logger.info(`createAccessData end. userNo: ${userNo}`);

    return accessData;
  }
}
