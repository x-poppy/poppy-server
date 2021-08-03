import { Provider } from '@augejs/core';

import { BusinessError } from '@/util/BusinessError';
import { I18nMessageKeys } from '@/util/I18nMessageKeys';
import { AxiosInstance, AXIOS_IDENTIFIER, Method } from '@augejs/axios';
import { Inject } from '@augejs/core';
import { KoaContext } from '@augejs/koa';
import { AccessData } from '@augejs/koa-access-token';
import { AppServerProxyRepository } from '@/infrastructure/repository/AppServerProxyRepository';

@Provider()
export class AppServerProxyService {
  @Inject(AXIOS_IDENTIFIER)
  httpService!: AxiosInstance;

  @Inject(AppServerProxyRepository)
  private appServerProxyRepository!: AppServerProxyRepository;

  async proxy(context: KoaContext, serverName: string, serverPath: string): Promise<unknown> {
    const queries = context.request.query;
    const accessData = context.accessData as AccessData;
    const userNo = accessData.userId.toString();
    const userRoleNo = accessData.get<string>('userRoleNo');
    const appNo = accessData.get<string>('appNo');
    const appOrgNo = accessData.get<string>('appOrgNo');
    const userOrgNo = accessData.get<string>('userOrgNo');

    const appServerProxy = await this.appServerProxyRepository.findByStatusNormal(appNo, serverName);
    if (!appServerProxy) {
      throw new BusinessError(I18nMessageKeys.Proxy_Server_Is_Not_Exist);
    }

    const serverUrlStr = appServerProxy.serverUrl;
    if (!serverUrlStr) {
      throw new BusinessError(I18nMessageKeys.Proxy_Server_Url_Error);
    }

    const serverUrlArr: string[] = serverUrlStr
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);
    if (!serverUrlArr || serverUrlArr.length === 0) {
      throw new BusinessError(I18nMessageKeys.Proxy_Server_Url_Error);
    }

    const serverUrl = serverUrlArr.length === 1 ? serverUrlArr[0] : serverUrlArr[Math.trunc(Math.random() * serverUrlArr.length)];

    const response = await this.httpService.request({
      baseURL: serverUrl,
      url: serverPath,
      method: context.method as Method,
      params: queries,
      timeout: appServerProxy.timeout ?? 60000,
      headers: {
        'x-user-no': userNo,
        'x-user-role-no': userRoleNo,
        'x-app-no': appNo,
        'x-app-org-no': appOrgNo,
        'x-user-org-no': userOrgNo,
      },
    });

    return response.data;
  }
}
