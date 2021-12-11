import { Inject, Provider } from '@augejs/core';
import { OperationLogRepository } from '../../infrastructure/repository/OperationLogRepository';
import { OperationLogEntity } from '../model/OperationLogEntity';
import { PPService } from './PPService';

@Provider()
export class OperationLogService  extends PPService<OperationLogEntity, OperationLogRepository> {
  @Inject(OperationLogRepository)
  protected override repository!: OperationLogRepository;
}
