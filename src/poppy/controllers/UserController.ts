import { GetLogger, ILogger, Inject, Provider, ScanHook, ScanNode } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
// import { UserRepository } from '../repositories/UserRepository';

@Prefix('/api/user')
@Provider()
export class UserController {
  @Inject(UserRepository)
  userRepository!: UserRepository;

  @GetLogger()
  logger!: ILogger;

  /**
   * @api {get} /api/user/findAllUsers findAllUsers
   *
   * @apiGroup User
   *
   * @apiSampleRequest /api/user/findAllUsers
   */
  @RequestMapping.Get()
  async findAllUsers(@RequestParams.Context() ctx: KoaContext): Promise<User[]> {
    this.logger.info(ctx.header);
    return await this.userRepository.findAllUsers();
  }

  /**
   * @api {post} /api/user/createNewUser createNewUser
   *
   * @apiGroup User
   *
   * @apiSampleRequest /api/user/createNewUser
   */
  @RequestMapping.Post()
  async createNewUser(): Promise<User> {
    return await this.userRepository.createNewUser();
  }

  /**
   * @api {get} /api/user/test test
   *
   * @apiGroup User
   *
   * @apiSampleRequest /api/user/test
   */
  @RequestMapping.Get()
  async test(): Promise<string> {
    // eslint-disable-next-line no-debugger
    debugger;
    return 'hello';
  }
}
