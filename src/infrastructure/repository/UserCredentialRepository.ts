import { Inject, Provider } from '@augejs/core';
import { UserCredentialDO } from '@/domain/model/UserCredentialDO';
import { PPRepository } from './PPRepository';
import { EntityManager } from '@augejs/typeorm';
import { DeepPartialData } from '@/types/DeepPartialData';
import { RandomService } from '../service/RandomService';

@Provider()
export class UserCredentialRepository extends PPRepository<UserCredentialDO>{

  @Inject(RandomService)
  private randomService!: RandomService;

  constructor() {
    super(UserCredentialDO);
  }

  override async create(condition: DeepPartialData<UserCredentialDO>, manager?: EntityManager): Promise<UserCredentialDO> {
    return this.getRepository(manager).save({
      ...condition,
      nonce: this.randomService.nonce(),
      passwd: this.randomService.nonce()
    });
  }
}
