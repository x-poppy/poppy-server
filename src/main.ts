import path from 'path';

import { Module, ILogger, boot, GetLogger, __appRootDir, Value } from '@augejs/module-core';
import { WebServer } from '@augejs/koa';
import { KoaStatic, KoaFavicon } from '@augejs/koa-static';
import { I18n } from '@augejs/i18n';
import { HomeModule } from './modules/home';
import { AxiosConfig } from '@augejs/axios';
import { YAMLConfig } from '@augejs/file-config';
@I18n()
@YAMLConfig()
@KoaFavicon()
@AxiosConfig()
@KoaStatic()
@WebServer()
@Module({
  subModules: [
    HomeModule,
  ]
})
class AppModule {

  @Value('/webserver.port')
  webserverPort!: number

  @GetLogger()
  logger!: ILogger;

  async onInit() {
    this.logger.info('app onInit');
  }

  async onAppDidReady () {
    this.logger.info('app onInit');
    this.logger.info(`http://127.0.0.1:${this.webserverPort}`);
  }
}

async function main() {
  await boot(AppModule);
}

main();
