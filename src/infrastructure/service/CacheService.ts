import { Inject, Provider } from "@augejs/core";
import { REDIS_IDENTIFIER, Commands } from "@augejs/redis";
import ms from 'ms';

const CACHE_PREFIX = 'cache:';
const DefaultExpireTime = ms('10m');

@Provider()
export class CacheService {

  @Inject(REDIS_IDENTIFIER)
  redis!: Commands;

  async get(key: string): Promise<string | undefined> {
    try {
      return await this.redis.get(CACHE_PREFIX + key) ?? undefined;
    // eslint-disable-next-line no-empty
    } catch {
    }

    return undefined;
  }

  async set(key: string, value: string, expiryTime?: string | number | null): Promise<void> {
    if (expiryTime && typeof expiryTime == 'string') {
      expiryTime = ms(expiryTime);
    } else if (expiryTime === null) {
      expiryTime = DefaultExpireTime;
    }

    try {
      expiryTime ?
        await this.redis.set(CACHE_PREFIX + key, value, 'PX', expiryTime) :
        await this.redis.set(CACHE_PREFIX + key, value);
    // eslint-disable-next-line no-empty
    } catch(err) {
    }
  }
}
