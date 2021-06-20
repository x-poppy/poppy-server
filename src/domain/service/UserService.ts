import { Inject, Provider } from '@augejs/core';
import { UserEntity } from '../model/UserEntity';
import { UserRepository } from '../../infrastructure/repository/UserRepository';

@Provider()
export class UserService {
  @Inject(UserRepository)
  private userRepository!: UserRepository;
}
