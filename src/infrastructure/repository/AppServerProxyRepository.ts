import { AppServerProxyEntity, AppProxyServerStatus } from '@/domain/model/AppServerProxyEntity';
import { Inject, Provider } from '@augejs/core';
import { EntityManager, getRepository, Repository } from '@augejs/typeorm';

interface CreateOpts {
  appNo: string;
  serverName: string;
  serverUrl: string | string[];
  timeout?: number;
  displayName: string;
}

@Provider()
export class AppServerProxyRepository {
  private appServerProxyRepository: Repository<AppServerProxyEntity> = getRepository(AppServerProxyEntity);

  async findByStatusNormal(appNo: string, serverName: string): Promise<AppServerProxyEntity | undefined> {
    return await this.appServerProxyRepository.findOne(appNo, {
      where: {
        appNo,
        serverName,
        status: AppProxyServerStatus.NORMAL,
      },
    });
  }

  async create(opts: CreateOpts, manager?: EntityManager): Promise<AppServerProxyEntity> {
    const appServerProxyRepository = manager?.getRepository(AppServerProxyEntity) ?? this.appServerProxyRepository;

    const serverUrls: string[] = (Array.isArray(opts.serverUrl) ? opts.serverUrl : [opts.serverUrl]).map((url) => url.trim()).filter(Boolean);

    const appServerProxy = new AppServerProxyEntity();
    appServerProxy.appNo = opts.appNo;
    appServerProxy.serverName = opts.serverName;
    appServerProxy.serverUrl = serverUrls.join(',');

    await appServerProxyRepository.save(appServerProxy);
    return appServerProxy;
  }
}
