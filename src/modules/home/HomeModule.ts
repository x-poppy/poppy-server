import { RequestMapping } from '@augejs/koa';
import { GetLogger, ILogger, Provider, Value } from '@augejs/core';

@Provider()
export class HomeModule {
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
