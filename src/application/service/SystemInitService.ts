import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

import { GetLogger, ILogger, Inject, Provider, __appRootDir } from '@augejs/core';
import { getConnection, getRepository } from 'typeorm';
import { UniqueIdService } from '@/infrastructure/service/UniqueIdService';
import { Commands, REDIS_IDENTIFIER } from '@augejs/redis';
import { SystemInitEntity } from '@/domain/model/SystemInitEntity';
import { RandomService } from '@/infrastructure/service/RandomService';

@Provider()
export class SystemInitService {
  @GetLogger()
  logger!: ILogger;

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  @Inject(RandomService)
  private randomService!: RandomService;

  @Inject(REDIS_IDENTIFIER)
  redis!: Commands;

  async loadInitSql(): Promise<string> {

    const idGenerator = async () => this.uniqueIdService.getUniqueId();

    const initSqlContent = fs.readFileSync(path.join(__appRootDir, 'config/init.sql'), 'utf8')

      .replace(/\${appId}/g, await idGenerator())
      .replace(/\${appTitle}/g, 'Poppy System')
      .replace(/\${appDomainId}/g, await idGenerator())
      .replace(/\${appDomain}/g, '127.0.0.1%3A7001')
      .replace(/\${roleId}/g, await idGenerator())
      .replace(/\${roleTitle}/g, 'admin')
      .replace(/\${userId}/g, await idGenerator())
      .replace(/\${userName}/g, 'admin')
      .replace(/\${userNonce}/g, await this.randomService.nonce())
      .replace(/\${userPassword}/g, 'dev')
      .replace(/\${systemMenuId}/g, await idGenerator())
      ;
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
