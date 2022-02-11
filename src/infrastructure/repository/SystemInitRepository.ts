import { SystemInitDO } from '@/domain/model/SystemInitDO';
import { Provider } from '@augejs/core';
import { getRepository, Repository } from 'typeorm';

@Provider()
export class SystemInitRepository {
  private systemInitRepository: Repository<SystemInitDO> = getRepository(SystemInitDO);

  async has(): Promise<boolean> {
    const systemInit = await this.systemInitRepository.findOne(0);
    return !!systemInit;
  }
}
