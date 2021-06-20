import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { UserEntity } from '../../domain/model/UserEntity';
import { UserRepository } from '../../infrastructure/repository/UserRepository';
// import { UserRepository } from '../repositories/UserRepository';

@Prefix('/api/user')
@Provider()
export class UserController {
  @Inject(UserRepository)
  private userRepository!: UserRepository;

  @GetLogger()
  private logger!: ILogger;

  /**
   * @api {get} /api/user/findAllUsers findAllUsers
   *
   * @apiGroup User
   *
   * @apiSampleRequest /api/user/findAllUsers
   */
  @RequestMapping.Get()
  async findAllUsers(@RequestParams.Context() ctx: KoaContext): Promise<UserEntity[]> {
    this.logger.info(ctx.header);
    return await this.userRepository.findAllUsers();
  }

  @RequestMapping.Post()
  async createNewUser(): Promise<void> {
    // return await this.userRepository.createNewUser();
  }

  @RequestMapping.Get()
  async test(): Promise<string> {
    // eslint-disable-next-line no-debugger
    debugger;
    return 'hello';
  }
}
