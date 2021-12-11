import { Inject, Provider } from '@augejs/core';
import { UserCredentialEntity } from '@/domain/model/UserCredentialEntity';
import { PPRepository } from './PPRepository';
import { EntityManager } from '@augejs/typeorm';
import { DeepPartialData } from '@/types/DeepPartialData';
import { RandomService } from '../service/RandomService';

@Provider()
export class UserCredentialRepository extends PPRepository<UserCredentialEntity>{

  @Inject(RandomService)
  private randomService!: RandomService;

  constructor() {
    super(UserCredentialEntity);
  }

  override async create(condition: DeepPartialData<UserCredentialEntity>, manager?: EntityManager): Promise<UserCredentialEntity> {
    return this.getRepository(manager).save({
      ...condition,
      nonce: this.randomService.nonce(),
      passwd: this.randomService.nonce()
    });
  }
}
