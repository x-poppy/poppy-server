import { Module } from '@augejs/core';
import { RestfulAPIHandlerService } from './service/RestfulAPIHandlerService';
import { SystemInitService } from './service/SystemInitService';
@Module({
  providers: [RestfulAPIHandlerService, SystemInitService],
})
export class ApplicationLayerModule {}
