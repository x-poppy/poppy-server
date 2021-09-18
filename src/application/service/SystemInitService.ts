import crypto from 'crypto';

import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { getConnection, getRepository } from 'typeorm';
import { UniqueIdService } from '@/infrastructure/service/UniqueIdService';
import { Commands, REDIS_IDENTIFIER } from '@augejs/redis';
import { SystemInitEntity } from '@/domain/model/SystemInitEntity';

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
  -- root role
    INSERT INTO poppy.pp_role (roleNo, parent, inherited, orgNo, appNo, hasAppResPerms, \`level\`, displayName, \`desc\`)
    VALUES(${parameters.roleNo}, NULL, 1, NULL, ${parameters.appNo}, 1, 0, '_root', 'The _root role for the system');

    -- root app
    INSERT INTO poppy.pp_app (appNo, parent, \`level\`, orgNo, roleNo, \`locale\`, expireAt,  displayName, \`desc\`)
    VALUES(${parameters.appNo}, NULL, 0, NULL, ${parameters.roleNo}, 'en_US', date_add(now(), INTERVAL 99 YEAR) ,'Poppy System', 'The poppy System');

    INSERT INTO poppy.pp_app_domain (\`domain\`, appNo)
    VALUES('${parameters.appDomain}', ${parameters.appNo});

    INSERT INTO poppy.pp_menu (menuCode, parent, appNo, appLevel, \`type\`, position, icon, hasPermission, priority, label)
    VALUES('Setting', NULL, ${parameters.appNo}, 0, 'menu', 'home', NULL, 1, 0, 'Setting');

    INSERT INTO poppy.pp_menu (menuCode, parent, appNo, appLevel, \`type\`, position, icon, hasPermission, priority, label)
    VALUES('Setting-1', 'Setting', ${parameters.appNo}, 0, 'menu', 'home', NULL, 1, 0, 'Setting-1');

    INSERT INTO poppy.pp_menu (menuCode, parent, appNo, appLevel, \`type\`,position, icon, hasPermission, priority, label)
    VALUES('Head', NULL, ${parameters.appNo}, 0, 'menu', 'head', NULL, 0, 0, 'Head');

    INSERT INTO poppy.pp_menu (menuCode, parent, appNo, appLevel, \`type\`,position, icon, hasPermission, priority, label)
    VALUES('Head-1', 'Head', ${parameters.appNo}, 0, 'menu', 'head', NULL, 0, 0, 'Head-1');

    -- root org
    INSERT INTO poppy.pp_org (orgNo, appNo, parent, \`level\`, icon, displayName, \`desc\`)
    VALUES(${parameters.orgNo}, ${parameters.appNo}, NULL, 0, NULL, 'Root Org', 'The root org for the system');

    INSERT INTO poppy.pp_role (roleNo, parent, inherited, orgNo, appNo, hasAppResPerms, \`level\`, displayName, \`desc\`)
    VALUES(${parameters.orgRoleNo}, ${parameters.roleNo}, 1, ${parameters.orgNo}, ${parameters.appNo}, 0, 1, 'root', 'The root role for the system');

    INSERT INTO poppy.pp_user (userNo, orgNo, appNo, roleNo, nonce, accountName, mobileNo, emailAddr, passwd, optKey, registerIP)
    VALUES(${parameters.orgUserNo}, ${parameters.orgNo}, ${parameters.appNo}, ${parameters.orgRoleNo}, '${parameters.orgUserNonce}', '${parameters.orgUserName}', NULL, NULL, '${parameters.orgUserPassword}', NULL, '127.0.0.1');

    -- root app theme
    INSERT INTO poppy.pp_app_theme (appNo, \`key\`, \`value\`, \`desc\`)
    VALUES(${parameters.appNo}, '--login-page-bg', 'azure', 'background for login page');

    INSERT INTO poppy.pp_app_theme (appNo, \`key\`, \`value\`, \`desc\`)
    VALUES(${parameters.appNo}, '--home-page-bg', 'border-box', 'background for home page');

    INSERT INTO poppy.pp_app_theme (appNo, \`key\`, \`value\`, \`desc\`)
    VALUES(${parameters.appNo}, '--default-page-bg', 'cadetblue', 'background for default page');

    -- root page
    INSERT INTO poppy.pp_page (appNo, pageCode,\`type\`, \`content\`, \`desc\`)
    VALUES(${parameters.appNo}, 'test', 'htmlUrl', 'test', 'for test');
  `;
}

@Provider()
export class SystemInitService {
  @GetLogger()
  logger!: ILogger;

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  @Inject(REDIS_IDENTIFIER)
  redis!: Commands;

  async onAppWillReady(): Promise<void> {
    const systemHasInitialized = await getRepository(SystemInitEntity).findOne(0);
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

    const sqlStatements = sql
      .split(';')
      .map((sqlStatement) => sqlStatement.trim())
      .filter(Boolean)
      .map((sqlStatement) => `${sqlStatement};\n`);

    const queryRunner = getConnection().createQueryRunner('master');
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const sqlStatement of sqlStatements) {
        await queryRunner.query(sqlStatement);
      }
      await queryRunner.query(`INSERT INTO poppy.pp_system_init (id, initSql) VALUES(0, '${Buffer.from(sql).toString('base64')}');`);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.info('System Prepare Data failed rollback.');
      throw err;
    } finally {
      await queryRunner.release();
    }
    this.logger.info('System Prepare Data for init end.');
  }
}
