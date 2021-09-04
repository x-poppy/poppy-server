import crypto from 'crypto';

import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { SystemInitRepository } from '@/infrastructure/repository/SystemInitRepository';
import { getConnection, getManager } from 'typeorm';
import { UniqueIdService } from '@/infrastructure/service/UniqueIdService';
import { Commands, REDIS_IDENTIFIER } from '@augejs/redis';

interface SystemInitSqlParameters {
  roleNo: string;
  appNo: string;
  appDomain: string;
  orgNo: string;
  orgRoleNo: string;
  orgUserNo: string;
  orgUserName: string;
  orgUserPassword: string;
  orgUserNonce: string;
}

function getSystemInitSql(parameters: SystemInitSqlParameters) {
  return `
  INSERT INTO poppy.pp_role (roleNo, parent, inherited, orgNo, appNo, hasAppResPerms, \`level\`, displayName, \`desc\`) VALUES(${parameters.roleNo}, NULL, 1, NULL, ${parameters.appNo}, 1, 0, '_root', 'The _root role for the system');
  INSERT INTO poppy.pp_app (appNo, parent, \`level\`, orgNo, roleNo, \`locale\`, displayName, \`desc\`) VALUES(${parameters.appNo}, NULL, 0, NULL, ${parameters.roleNo}, 'en_US', 'Poppy System', 'The poppy System');
  `;
}

@Provider()
export class SystemInitService {
  @GetLogger()
  logger!: ILogger;

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  @Inject(SystemInitRepository)
  systemInitRepository!: SystemInitRepository;

  @Inject(REDIS_IDENTIFIER)
  redis!: Commands;

  async onAppWillReady(): Promise<void> {
    const systemHasInitialized = await this.systemInitRepository.has();
    if (systemHasInitialized) {
      this.logger.info('System has Initialized. Skip');
      return;
    }

    // here is redis lock for
    const lockResult = await this.redis.set('System_Init_Sql_Lock', 'Y', 'EX', 30, 'NX');
    if (lockResult !== 'OK') {
      this.logger.info('System not get System_Init_Sql_Lock lock. Skip');
      return;
    }

    this.logger.info('System Prepare Data for init start.');

    const roleNo = await this.uniqueIdService.getUniqueId();
    const appNo = await this.uniqueIdService.getUniqueId();
    const appDomain = 'http://localhost:7001';
    const orgNo = await this.uniqueIdService.getUniqueId();
    const orgRoleNo = await this.uniqueIdService.getUniqueId();
    const orgUserNo = await this.uniqueIdService.getUniqueId();
    const orgUserName = 'root';
    const orgUserPassword = 'dev';
    const orgUserNonce = crypto.randomBytes(16).toString('hex');

    const sql = getSystemInitSql({
      roleNo,
      appNo,
      appDomain,
      orgNo,
      orgRoleNo,
      orgUserNo,
      orgUserName,
      orgUserPassword,
      orgUserNonce,
    });

    await getConnection().query(sql);
    await this.systemInitRepository.add(sql);

    this.logger.info('System Prepare Data for init end.');
  }
}
