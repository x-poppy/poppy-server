import { OperationLogEntity } from '@/domain/model/OperationLogEntity';
import { FindManyOpt } from '@/types/FindManyOpt';
import { Inject, Provider } from '@augejs/core';
import { DeepPartial, EntityManager, LessThan } from '@augejs/typeorm';
import { UniqueIdService } from '../service/UniqueIdService';
import { PPRepository } from './PPRepository';

@Provider()
export class OperationLogRepository  extends PPRepository<OperationLogEntity> {

  @Inject(UniqueIdService)
  private uniqueIdService!: UniqueIdService;

  constructor() {
    super(OperationLogEntity);
  }

  override async create(data: DeepPartial<OperationLogEntity>, manager?: EntityManager): Promise<OperationLogEntity> {
    const id = data.id ?? await this.uniqueIdService.getUniqueId();
    return this.getRepository(manager).save({
      ...data,
      id,
    });
  }

  override async findMany(condition: DeepPartial<OperationLogEntity>, opts?: FindManyOpt): Promise<[OperationLogEntity[], number]> {
    return this.getRepository().findAndCount({
      ...(opts?.pagination && {
        skip: opts.pagination.offset,
        take: opts.pagination.size,
      }),
      where: {
        ...(condition.appId && {
          appId: condition.appId
        }),
        ...(condition.operator && {
          operator: condition.operator
        }),
        ...(condition.viewLevel && {
          viewLevel: LessThan(condition.viewLevel)
        }),
        ...(condition.action && {
          action: condition.action
        }),
        ...(condition.operatorIP && {
          operatorIP: condition.operatorIP
        })
      },
      order: {
        createAt: 'DESC',
        action: 'ASC',
        ...opts?.order,
      }
    });
  }
}
