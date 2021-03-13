import { Module } from '@augejs/core';
import { RedisExampleController } from './controllers/RedisExampleController';

@Module({
  providers: [RedisExampleController],
})
export class AppModule {}
