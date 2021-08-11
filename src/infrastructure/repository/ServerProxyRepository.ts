import { ServerProxyEntity, ProxyServerStatus } from '@/domain/model/ServerProxyEntity';
import { Provider } from '@augejs/core';
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
  private appServerProxyRepository: Repository<ServerProxyEntity> = getRepository(ServerProxyEntity);

  async findByStatusNormal(appNo: string, serverName: string): Promise<ServerProxyEntity | undefined> {
    return await this.appServerProxyRepository.findOne(appNo, {
      where: {
        appNo,
        serverName,
        status: ProxyServerStatus.NORMAL,
      },
    });
  }

  async create(opts: CreateOpts, manager?: EntityManager): Promise<ServerProxyEntity> {
    const appServerProxyRepository = manager?.getRepository(ServerProxyEntity) ?? this.appServerProxyRepository;

    const serverUrls: string[] = (Array.isArray(opts.serverUrl) ? opts.serverUrl : [opts.serverUrl]).map((url) => url.trim()).filter(Boolean);

    const appServerProxy = new ServerProxyEntity();
    appServerProxy.appNo = opts.appNo;
    appServerProxy.serverName = opts.serverName;
    appServerProxy.serverUrl = serverUrls;

    await appServerProxyRepository.save(appServerProxy);
    return appServerProxy;
  }
}
