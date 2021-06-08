import { Module, boot, GetLogger, ILogger } from '@augejs/core';
import { WebServer } from '@augejs/koa';
import { KoaSwagger } from '@augejs/koa-swagger';
import { KoaStatic, KoaFavicon } from '@augejs/koa-static';
import { I18n } from '@augejs/i18n';
import { AxiosConfig } from '@augejs/axios';
import { YAMLConfig } from '@augejs/file-config';
import { Log4js } from '@augejs/log4js';
import { MailTransport } from '@augejs/mail';
import { Typeorm } from '@augejs/typeorm';

import { PoppyModule } from './poppy/PoppyModule';
import { Views } from '@augejs/views';
@I18n()
@Typeorm({
  synchronize: process.env.NODE_ENV === 'development',
})
@MailTransport()
@Log4js()
@YAMLConfig()
@KoaFavicon()
@KoaSwagger()
@AxiosConfig()
@KoaStatic()
@WebServer()
@Views()
@Module({
  subModules: [PoppyModule],
})
class AppModule {
  @GetLogger()
  logger!: ILogger;

  async onAppDidReady() {
    this.logger.info('app onAppDidReady');
  }
}

async function main() {
  await boot(AppModule);
}

main();
