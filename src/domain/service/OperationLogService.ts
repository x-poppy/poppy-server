import { Inject, Provider } from '@augejs/core';
import { OperationLogRepository } from '../../infrastructure/repository/OperationLogRepository';
import { OperationLogDO } from '../model/OperationLogDO';
import { PPService } from './PPService';

@Provider()
export class OperationLogService  extends PPService<OperationLogDO, OperationLogRepository> {
  @Inject(OperationLogRepository)
  protected override repository!: OperationLogRepository;
}
