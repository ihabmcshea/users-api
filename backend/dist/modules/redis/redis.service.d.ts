import { Cache } from 'cache-manager';
export declare class RedisService {
  private readonly cacheManager;
  private readonly redisClient;
  private readonly subscriber;
  constructor(cacheManager: Cache);
  publish(channel: string, message: string): Promise<void>;
  setExpirable(key: string, value: string, expiryInHours: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  subscribe(channel: string, callback: (message: string) => void): Promise<void>;
}
