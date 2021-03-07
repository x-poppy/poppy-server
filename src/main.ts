import { Module, boot } from '@augejs/core';
import { WebServer } from '@augejs/koa';
import { KoaStatic, KoaFavicon } from '@augejs/koa-static';
import { I18n } from '@augejs/i18n';
import { AxiosConfig } from '@augejs/axios';
import { YAMLConfig } from '@augejs/file-config';
import { Log4js } from '@augejs/log4js';
import { MailTransport } from '@augejs/mail';

import { WebAPIModule } from './modules/biz';
import { APIDocModule } from './modules/apiDoc';
import { HomeModule } from './modules/home';

@I18n()
@MailTransport()
@Log4js()
@YAMLConfig()
@KoaFavicon()
@AxiosConfig()
@KoaStatic()
@WebServer()
@Module({
  subModules: [HomeModule, WebAPIModule, APIDocModule],
})
class AppModule {}

async function main() {
  await boot(AppModule);
}

main();
