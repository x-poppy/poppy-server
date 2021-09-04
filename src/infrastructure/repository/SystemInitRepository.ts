import { SystemInitEntity } from '@/domain/model/SystemInitEntity';
import { Provider } from '@augejs/core';
import { getRepository, Repository } from 'typeorm';

@Provider()
export class SystemInitRepository {
  private systemInitRepository: Repository<SystemInitEntity> = getRepository(SystemInitEntity);

  async has(): Promise<boolean> {
    const systemInit = await this.systemInitRepository.findOne(0);
    return !!systemInit;
  }

  async add(initSql: string): Promise<void> {
    await this.systemInitRepository.insert({
      id: 0,
      initSql,
    });
  }
}
