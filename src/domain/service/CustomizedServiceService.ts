import { CustomizedServiceRepository } from '@/infrastructure/repository/CustomizedServiceRepository';
import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { Container, GetContainer, GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { CustomizedServiceEntity, CustomizedServiceStatus } from '../model/CustomizedServiceEntity';
import { PPService } from './PPService';

@Provider()
export class CustomizedServiceService extends PPService<CustomizedServiceEntity, CustomizedServiceRepository> {

  @GetLogger()
  private readonly logger!: ILogger;

  @Inject(CustomizedServiceRepository)
  protected override repository!: CustomizedServiceRepository;

  @GetContainer()
  container!: Container;

  async checkServiceAvailable(appId: string, serviceCode: string): Promise<boolean> {
    const channel = await this.repository.findOne({ appId, serviceCode, status: CustomizedServiceStatus.NORMAL }, { select: ['id'] });
    if (!channel) return false;
    return true;
  }

  async findAndVerify(appId: string, serviceCode: string, allowNotExist = true): Promise<CustomizedServiceEntity | undefined> | never {
    const customizedService = await this.repository.findOne ({ appId, serviceCode }, { select: ['extParams', 'status'] });
    if (!customizedService) {
      if (allowNotExist) {
        return undefined;
      }
      this.logger.info(`Customized_Service_Is_Not_Exist. appId: ${appId} serviceCode: ${serviceCode}`);
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    if (customizedService.status === CustomizedServiceStatus.DISABLED) {
      this.logger.warn(`Customized_Service_Is_Disabled. appId: ${appId} serviceCode: ${serviceCode}`);
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Disabled);
    }

    if (customizedService.status !== CustomizedServiceStatus.NORMAL) {
      this.logger.warn(`Customized_Service_Is_Not_Normal. appId: ${appId} serviceCode: ${serviceCode}`);
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Normal);
    }

    return customizedService;
  }

  private findServiceModuleInstance(moduleCode: string):any | null {
    let targetServiceModule: any | null = null;

    if (!this.container.isBound(moduleCode)) return null;

    const serviceModules = this.container.getAll(moduleCode);
        // .filter((service: IChannelPayTypeService) => {
        //   return isPayType(service, payType);
        // });

    if (serviceModules.length > 0) {
      targetServiceModule = serviceModules[0];
    }

    return targetServiceModule;
  }

  async request(ctx: KoaContext, appId: string, serviceCode: string): Promise<any> {
    const customizedService = await this.findOne({appId, serviceCode});
    if (!customizedService) {
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    const serviceModule =  this.findServiceModuleInstance(customizedService.moduleCode);
    if (!serviceModule) {
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    return serviceModule.request(ctx, customizedService);
  }

  async callback(ctx: KoaContext, appId: string, serviceCode: string): Promise<any> {
    const customizedService = await this.findOne({appId, serviceCode});
    if (!customizedService) {
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    const serviceModule =  this.findServiceModuleInstance(customizedService.moduleCode);
    if (!serviceModule) {
      throw new BusinessError(I18nMessageKeys.Customized_Service_Is_Not_Exist);
    }

    return serviceModule.callback(ctx, customizedService);
  }
}
