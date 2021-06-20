import { Inject, Provider } from '@augejs/core';
import { OperationLogRepository } from '../../infrastructure/repository/OperationLogRepository';


interface ListOpts {
  offset: number,
  size: number,
  appNo:bigint
  orgNo?: bigint | null
}

@Provider()
export class OperationLogService {

  @Inject(OperationLogRepository)
  private operationLogRepository!: OperationLogRepository;

  list() {

  }
}
