import crypto from 'crypto';
import { Inject, Provider } from "@augejs/core";
import { URL } from 'url';
import { AxiosInstance, AXIOS_IDENTIFIER } from '@augejs/axios';

export enum SignType {
  MD5 = 'md5',
}

export interface RequestOpts {
  appId: string
  serviceCode: string
  moduleCode: string | null
  apiKey: string | null
  timeout?: number
  config?: Record<string, unknown>
  credentials?: Record<string, unknown>
  mockResponse?: string | null
  query?: Record<string, unknown>
  action?: string,
  data?: Record<string, unknown>
  headers?: Record<string, string>
}

export interface AdapterHttpResponse {
  url: string
  headers: Record<string, string>
  status: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

@Provider()
export class AdapterHttpService {

  @Inject(AXIOS_IDENTIFIER)
  private readonly httpService!: AxiosInstance;

  sign(signKey: string, signContent: string, signType: SignType = SignType.MD5): string {
    signType ||= SignType.MD5;

    const hashStr = crypto.createHash(signType).update(signContent + signKey).digest('hex');
    return hashStr;
  }

  checkSign(signKey: string, signContent: string, sign: string, signType: SignType = SignType.MD5): boolean {
    return this.sign(signKey, signContent, signType) === sign;
  }

  async request(requestUrl: string, opts: RequestOpts): Promise<AdapterHttpResponse> {
    if (opts.mockResponse) {
      let mockResponseData;
      try {
        mockResponseData = JSON.parse(opts.mockResponse);
      // eslint-disable-next-line no-empty
      } catch {
        mockResponseData = {};
      }

      return {
        url: requestUrl,
        status: 200,
        headers: {
        },
        data: mockResponseData,
      }
    }

    const requestUrls = requestUrl.split(',').map(itemUrl => itemUrl.trim()).filter(Boolean);
    requestUrl = requestUrls.length === 1 ? requestUrls[0] : requestUrls[Math.trunc(Math.random() * requestUrls.length)];
    requestUrl = new URL(opts.action ?? '', requestUrl).href;

    const apiSequence = Date.now() + '';
    const appId = opts.appId;
    const serviceCode = opts.serviceCode;
    const moduleCode = opts.moduleCode;
    const apiKey = opts.apiKey ?? '';
    const timeout = opts.timeout ?? 30000;
    const signContent = `${appId}${serviceCode}${moduleCode}${apiKey}${apiSequence}`;
    const sign = this.sign(apiKey, signContent, SignType.MD5);

    const response = await this.httpService.request({
      method: 'post',
      timeout,
      url: requestUrl,
      params: opts.query,
      headers: {
        ...opts.headers,
        'app-id': appId,
        'service-code': serviceCode,
        'module-code': moduleCode,
        'api-sequence': apiSequence,
        'sign': sign,
      },
      data: {
        config: opts.config,
        credentials: opts.credentials,
        data: opts.data
      },
      responseType: 'json',
    })

    return {
      url: requestUrl,
      status: response.status,
      headers: response.headers,
      data: response.data,
    }
  }
}
