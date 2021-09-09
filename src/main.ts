import path from 'path';
import { Module, boot, GetLogger, ILogger, Cluster, __appRootDir } from '@augejs/core';
import { WebServer } from '@augejs/koa';
import { KoaStatic, KoaFavicon, KoaSend } from '@augejs/koa-static';
import { I18nConfig } from '@augejs/i18n';
import { AxiosConfig } from '@augejs/axios';
import { YAMLConfig } from '@augejs/file-config';
import { RedisConnection } from '@augejs/redis';
import { Log4js } from '@augejs/log4js';
import { MailTransport } from '@augejs/mail';
import { Typeorm } from '@augejs/typeorm';
import { KoaAccessTokenManager } from '@augejs/koa-access-token';
import { KoaStepTokenManager } from '@augejs/koa-step-token';
import { Views } from '@augejs/views';
import { KoaSwagger } from '@augejs/koa-swagger';

import { ApplicationLayerModule } from './application';
import { DomainLayerModule } from './domain';
import { FacadeLayerModule } from './facade';
import { InfrastructureLayerModule } from './infrastructure';
import { KoaSecurityMiddleware } from '@augejs/koa-security';
@Cluster({
  workers: 0,
  enable: process.env.NODE_ENV === 'production',
})
@I18nConfig()
@Typeorm({
  synchronize: process.env.NODE_ENV !== 'production',
})
@MailTransport()
@Log4js()
@YAMLConfig()
@KoaFavicon()
@AxiosConfig()
@KoaSecurityMiddleware()
@KoaStatic({
  prefix: '',
  dir: path.join(__appRootDir, './node_modules/@x-poppy/poppy-web/build'),
})
@WebServer()
@Views()
@KoaSwagger()
@RedisConnection()
@KoaAccessTokenManager({})
@KoaStepTokenManager()
@KoaSend()
@Module({
  subModules: [FacadeLayerModule, ApplicationLayerModule, DomainLayerModule, InfrastructureLayerModule],
})
class AppModule {
  @GetLogger()
  logger!: ILogger;

  async onAppDidReady(): Promise<void> {
    this.logger.info('server is running! ' + __appRootDir);
  }
}

async function main() {
  await boot(AppModule);
}

main();
