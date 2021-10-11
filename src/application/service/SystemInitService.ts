import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

import { GetLogger, ILogger, Inject, Provider, __appRootDir } from '@augejs/core';
import { getConnection, getRepository } from 'typeorm';
import { UniqueIdService } from '@/infrastructure/service/UniqueIdService';
import { Commands, REDIS_IDENTIFIER } from '@augejs/redis';
import { SystemInitEntity } from '@/domain/model/SystemInitEntity';

@Provider()
export class SystemInitService {
  @GetLogger()
  logger!: ILogger;

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  @Inject(REDIS_IDENTIFIER)
  redis!: Commands;

  async loadInitSql(): Promise<string> {
    const roleNo = await this.uniqueIdService.getUniqueId();
    const appNo = await this.uniqueIdService.getUniqueId();
    const appDomain = 'http://localhost:7001';
    const userNo = await this.uniqueIdService.getUniqueId();
    const userAccountName = 'root';
    const userPassword = 'dev';
    const userNonce = crypto.randomBytes(16).toString('hex');

    const initSqlContent = fs
      .readFileSync(path.join(__appRootDir, 'config/init.sql'), 'utf8')
      .replace(/\${roleNo}/g, roleNo)
      .replace(/\${appNo}/g, appNo)
      .replace(/\${appDomain}/, appDomain)
      .replace(/\${userNo}/, userNo)
      .replace(/\${userAccountName}/, userAccountName)
      .replace(/\${userPassword}/, userPassword)
      .replace(/\${userNonce}/, userNonce);

    return initSqlContent;
  }

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

    const sql = await this.loadInitSql();

    console.log(sql);

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
