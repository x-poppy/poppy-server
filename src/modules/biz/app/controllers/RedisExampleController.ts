import { Inject, Provider } from '@augejs/core';
import { Prefix, RequestMapping } from '@augejs/koa';
import { REDIS_IDENTIFIER, Commands } from '@augejs/redis';

@Provider()
@Prefix('redis')
export class RedisExampleController {
  @Inject(REDIS_IDENTIFIER)
  redis!: Commands;

  /**
   * @api {post} /redis/key setting the redis key
   *
   * @apiGroup Redis
   *
   * @apiSampleRequest /redis/key
   */

  @RequestMapping.Post()
  async key(): Promise<string | null> {
    const result = await this.redis.set('hello', 'hello', 'EX', 200000);

    return result;
  }
}
