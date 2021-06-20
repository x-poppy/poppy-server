import { AppService } from '@/domain/service/AppService';
import { OrgService } from '@/domain/service/OrgService';
import { AppRepository } from '@/infrastructure/repository/AppRepository';
import { OrgRepository } from '@/infrastructure/repository/OrgRepository';
import { RoleRepository } from '@/infrastructure/repository/RoleRepository';
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

  async onAppWillReady() {
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
      rootOrg = await this.orgService.create({
        appNo: rootApp.appNo,
        orgDisplayName: 'Admin Org',
        orgDesc: 'This Admin Org for the system',
        roleDisplayName: 'Admin',
        roleDesc: 'The admin role for the system',
        userAccountName: 'admin',
        userPassword: 'admin',
        userDisplayName: 'admin',
      });
      this.logger.info(`System Prepare Data for init start. step created root org. orgNo: ${rootOrg.orgNo}`);
    } else {
      this.logger.info(`System Prepare Data for init start. step use exist root org. orgNo: ${rootOrg.orgNo}`);
    }

    this.logger.info('System Prepare Data for init end.');
  }
}
