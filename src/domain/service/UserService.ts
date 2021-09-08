import { Inject, Provider } from '@augejs/core';
import { UserEntity } from '../model/UserEntity';
import { UserRepository } from '../../infrastructure/repository/UserRepository';

interface ListOpts {
  appNo: string;
  offset: number;
  size: number;
}

@Provider()
export class UserService {
  @Inject(UserRepository)
  private userRepository!: UserRepository;

  async list(opts: ListOpts): Promise<[UserEntity[], number]> {
    return this.userRepository.list(opts);
  }
}
