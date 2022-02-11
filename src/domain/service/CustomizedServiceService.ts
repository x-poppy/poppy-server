import { CustomizedServiceRepository } from '@/infrastructure/repository/CustomizedServiceRepository';
import { BusinessError } from '@/util/BusinessError';
import { isServiceModuleTag } from '@/util/decorator/ServiceModuleTag';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { Container, GetContainer, GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { CustomizedServiceDO, CustomizedServiceStatus } from '../model/CustomizedServiceDO';
import { CustomizedServiceAdapter } from './customizedServiceAdapter/CustomizedServiceAdapter';
import { PPService } from './PPService';

@Provider()
export class CustomizedServiceService extends PPService<CustomizedServiceDO, CustomizedServiceRepository> {

  @GetLogger()
  private readonly logger!: ILogger;

  @Inject(CustomizedServiceRepository)
  protected override repository!: CustomizedServiceRepository;

  @GetContainer()
  container!: Container;

  async checkServiceAvailable(appId: string, serviceCode: string): Promise<boolean> {
    const customizedServiceDO = await this.repository.findOne({ appId, serviceCode, status: CustomizedServiceStatus.NORMAL }, { select: ['status'] });
    if (!customizedServiceDO) {
      return false;
    }

    if (customizedServiceDO.status !== CustomizedServiceStatus.NORMAL) {
      return false;
    }

    return true;
  }

  async findAndVerify(appId: string, serviceCode: string, allowNotExist = true): Promise<CustomizedServiceDO | undefined> | never {
    const customizedService = await this.repository.findOne ({ appId, serviceCode });
    this.verify(appId, serviceCode, allowNotExist, customizedService);
    return customizedService;
  }

  private verify(appId: string, serviceCode: string, allowNotExist = true, customizedServiceDO?: CustomizedServiceDO): void | never {
    if (!customizedServiceDO) {
      if (allowNotExist) {
        return;
      }
      this.logger.info(`Customized_Service_Is_Not_Exist. appId: ${appId} serviceCode: ${serviceCode}`);
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    if (customizedServiceDO.status === CustomizedServiceStatus.DISABLED) {
      this.logger.warn(`Customized_Service_Is_Disabled. appId: ${appId} serviceCode: ${serviceCode}`);
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Disabled);
    }

    if (customizedServiceDO.status !== CustomizedServiceStatus.NORMAL) {
      this.logger.warn(`Customized_Service_Is_Not_Normal. appId: ${appId} serviceCode: ${serviceCode}`);
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Normal);
    }
  }

  private findServiceAdapter(moduleCode: string | null):CustomizedServiceAdapter | null {
    if (!moduleCode) return null;
    if (!this.container.isBound(moduleCode)) return null;

    const serviceAdapters = this.container.getAll<object>(moduleCode)
        .filter((service) => {
          return isServiceModuleTag(service, moduleCode);
        });

    if (serviceAdapters.length <= 0) return null;

    return serviceAdapters[0];
  }

  async findAndVerifyServiceAdapter<T>(customizedServiceDO: CustomizedServiceDO):Promise<T | null> | never {
    this.verify(customizedServiceDO.appId, customizedServiceDO.serviceCode, false, customizedServiceDO);
    const adapterService =  this.findServiceAdapter(customizedServiceDO.moduleCode);
    if (!adapterService) {
      return null;
    }

    return adapterService as T;
  }

  async request(ctx: KoaContext, appId: string, serviceCode: string): Promise<void> {
    const customizedServiceDO = (await this.findOne({ appId, serviceCode })) as CustomizedServiceDO;
    this.verify(appId, serviceCode, false, customizedServiceDO);

    const serviceModule =  this.findServiceAdapter(customizedServiceDO.moduleCode);
    if (!serviceModule) {
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    await serviceModule.request?.(ctx, customizedServiceDO);
  }
}
