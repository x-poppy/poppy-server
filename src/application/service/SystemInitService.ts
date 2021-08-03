import crypto from 'crypto';
import randomPassword from 'secure-random-password';

import { AppService } from '@/domain/service/AppService';
import { OrgService } from '@/domain/service/OrgService';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';

@Provider()
export class SystemInitService {
  @Inject(AppRepository)
  appRepository!: AppRepository;

  @Inject(OrgRepository)
  orgRepository!: OrgRepository;

  @Inject(AppService)
  appService!: AppService;

  @Inject(OrgService)
  orgService!: OrgService;

  @GetLogger()
  logger!: ILogger;

  async onAppWillReady(): Promise<void> {
    this.logger.info('System Prepare Data for init start.');
    let rootApp = await this.appRepository.findRoot();
    if (!rootApp) {
      rootApp = await this.appService.create({
        userNo: null,
        roleDisplayName: 'Root',
        roleDesc: 'The root role for the system',
        appDisplayName: 'Root System',
        appDesc: 'The Root System',
      });
      this.logger.info(`System Prepare Data for init start. step created root app. appNo: ${rootApp.appNo}`);
    } else {
      this.logger.info(`System Prepare Data for init start. step use exist root app. appNo: ${rootApp.appNo}`);
    }

    let rootOrg = await this.orgRepository.findRoot();
    if (!rootOrg) {
      const rootUserName = 'root';
      const rootUserPassword = randomPassword.randomPassword({
        length: 32,
        characters: [randomPassword.lower, randomPassword.digits, randomPassword.upper, randomPassword.symbols],
      });

      crypto.randomBytes(16).toString('hex');
      rootOrg = await this.orgService.create({
        appNo: rootApp.appNo,
        orgDisplayName: 'Root Org',
        orgDesc: 'This root Org for the system',
        roleDisplayName: 'Root',
        roleDesc: 'The root role for the system',
        userAccountName: 'root',
        userPassword: rootUserPassword,
        userDisplayName: 'root',
      });
      this.logger.info(`System Prepare Data for init start. step created root org. orgNo: ${rootOrg.orgNo}`);
      this.logger.info('');
      this.logger.info('');
      this.logger.info('----------------------------------------------------------------------------');
      this.logger.info('Warning! Below is the credential information for root user, please delete it immediate');
      this.logger.info(`root use name: ${rootUserName}`);
      this.logger.info(`root use password: ${rootUserPassword}`);
      this.logger.info('----------------------------------------------------------------------------');
      this.logger.info('');
      this.logger.info('');
    } else {
      this.logger.info(`System Prepare Data for init start skipped and use the exist root org. orgNo: ${rootOrg.orgNo}`);
    }
    this.logger.info('System Prepare Data for init end.');
  }
}
