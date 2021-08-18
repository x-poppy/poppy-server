import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { AccessData } from '@augejs/koa-access-token/dist/AccessData';
import { I18N_IDENTIFIER, I18n } from '@augejs/i18n';

import { I18nMessageKeys } from '@/util/I18nMessageKeys';

import { AppConfigKeys } from '@/util/AppConfigKeys';

import { AppConfigService } from './AppConfigService';
import { RolePermissionService } from './RolePermissionService';
import { StepData } from '@augejs/koa-step-token';

@Provider()
export class SessionService {
  @GetLogger()
  logger!: ILogger;

  @Inject(I18N_IDENTIFIER)
  i18n!: I18n;

  @Inject(AppConfigService)
  private appConfigService!: AppConfigService;

  @Inject(RolePermissionService)
  private rolePermissionService!: RolePermissionService;

  private async kickOffOnlineUsers(context: KoaContext, userNo: string): Promise<void> {
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

  async createAccessData(context: KoaContext): Promise<AccessData> | never {
    const stepData = context.stepData as StepData;

    const userNo = stepData.get<string>('userNo');
    const userOrgNo = stepData.get<string>('userRoleNo');

    this.logger.info(`createAccessData start. userNo: ${userNo}`);

    const userPermissions = await this.rolePermissionService.findPermissionsByRoleNo(userOrgNo);

    await this.kickOffOnlineUsers(context, userNo);

    const accessData = context.createAccessData(userNo, process.env.NODE_ENV !== 'production' ? '2h' : undefined);

    accessData.set('userNo', userNo);
    accessData.set('userRoleNo', stepData.get('userRoleNo'));
    accessData.set('userOrgNo', stepData.get('userOrgNo'));
    accessData.set('appNo', stepData.get('appNo'));
    accessData.set('appOrgNo', stepData.get('appOrgNo'));

    accessData.set('userPermissions', userPermissions.toJson());

    await accessData.save();

    this.logger.info(`createAccessData end. userNo: ${userNo}`);

    return accessData;
  }
}
