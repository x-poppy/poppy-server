import { Module, ScanHook, ScanNode } from '@augejs/core';
import { KoaContext, MiddlewareHandler, Prefix, RequestMapping } from '@augejs/koa';
import { PageController } from './controllers/PageController';
import { UserController } from './controllers/UserController';
import { User } from './entities/User';
import { UserRepository } from './repositories/UserRepository';
import { SnowflakeService } from './services/SnowflakeService';
// import { UserRepository } from "./repositories/UserRepository";
// import { SnowflakeService } from "./services/SnowflakeService";

@Module({
  providers: [UserController, PageController, UserRepository, SnowflakeService],
})
export class PoppyModule {
  @MiddlewareHandler()
  async globalHandler(ctx: KoaContext, next: CallableFunction): Promise<void> {
    try {
      await next();
      console.log(ctx.url);
    } catch (err) {
      console.log('=====>>>');
    }
  }
}
