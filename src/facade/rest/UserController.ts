import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { UserEntity } from '../../domain/model/UserEntity';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
// import { UserRepository } from '../repositories/UserRepository';

@Prefix('/api/user/user')
@Provider()
export class UserController {
  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @GetLogger()
  private logger!: ILogger;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(@RequestParams.Context() ctx: KoaContext): Promise<UserEntity[]> {
    this.logger.info(ctx.header);
    return await this.userRepository.findAllUsers();
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Post('')
  async create(): Promise<Record<string, unknown>> {
    // return await this.userRepository.createNewUser();
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Delete('')
  async delete(): Promise<Record<string, unknown>> {
    return {};
  }

  @KoaAccessTokenMiddleware()
  @RequestMapping.Put()
  async update(): Promise<Record<string, unknown>> {
    return {};
  }
}
