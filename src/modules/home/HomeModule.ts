import { RequestMapping } from '@augejs/koa';
import { GetLogger, ILogger, Provider, Value } from '@augejs/core';

@Provider()
export class HomeModule {
  /**
   * @api {post} /tool/test Tool
   * @apiGroup tool
   *
   * @apiParam {String} merchantId="106000000000021" merchantId
   * @apiParam {String} merchantKey="xxxxxx" merchantKey
   * @apiParam {String="MD5","SHA"} signType="MD5" signType
   * @apiSampleRequest /test/toll
   */
  @RequestMapping.Get('/ping')
  async ping(): Promise<string> {
    return 'pong';
  }

  @Value('/webserver.port')
  webserverPort!: number;

  @GetLogger()
  logger!: ILogger;

  async onAppDidReady() {
    this.logger.info(`app onReady http://127.0.0.1:${this.webserverPort}`);
  }
}
