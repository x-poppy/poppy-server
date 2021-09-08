import { UserService } from '@/domain/service/UserService';
import { GetLogger, ILogger, Inject, Provider } from '@augejs/core';
import { KoaContext, Prefix, RequestMapping, RequestParams } from '@augejs/koa';
import { AccessData, KoaAccessTokenMiddleware } from '@augejs/koa-access-token';
import { UserEntity } from '../../domain/model/UserEntity';

@Prefix('/api/v1/user/user')
@Provider()
export class UserController {
  @Inject(UserService)
  private userService!: UserService;

  @GetLogger()
  private logger!: ILogger;

  @KoaAccessTokenMiddleware()
  @RequestMapping.Get('')
  async list(
    @RequestParams.Context() ctx: KoaContext,
    @RequestParams.Query('offset') @RequestParams((value: string) => parseInt(value)) offset: number,
    @RequestParams.Query('size') @RequestParams((value: string) => parseInt(value)) size: number,
  ): Promise<Record<string, unknown>> {
    const accessData = ctx.accessData as AccessData;
    const appNo = accessData.get<string>('appNo') ?? null;

    const [list, count] = await this.userService.list({
      offset,
      size,
      appNo,
    });

    return {
      list,
      count,
    };
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
