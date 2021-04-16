import { Module, boot, GetLogger, ILogger } from '@augejs/core';
import { WebServer } from '@augejs/koa';
import { KoaStatic, KoaFavicon } from '@augejs/koa-static';
import { I18n } from '@augejs/i18n';
import { AxiosConfig } from '@augejs/axios';
import { YAMLConfig } from '@augejs/file-config';
import { Log4js } from '@augejs/log4js';
import { MailTransport } from '@augejs/mail';
import { UserController } from './controllers/UserController';
import { UserRepository } from './repositories/UserRepository';
import { SnowflakeService } from './services/SnowflakeService';
import { Typeorm } from '@augejs/typeorm';

@I18n()
@Typeorm({
  synchronize: process.env.NODE_ENV === 'development',
})
@MailTransport()
@Log4js()
@YAMLConfig()
@KoaFavicon()
@AxiosConfig()
@KoaStatic()
@WebServer()
@Module({
  providers: [UserController, UserRepository, SnowflakeService],
})
class AppModule {
  @GetLogger()
  logger!: ILogger;

  async onInit() {
    this.logger.info('app onInit');
  }

  async onAppDidReady() {
    this.logger.info('app onAppDidReady');
  }
}

async function main() {
  await boot(AppModule);
}

main();
