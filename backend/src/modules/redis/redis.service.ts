import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  private readonly subscriber: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
    this.subscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async publish(channel: string, message: string) {
    await this.redisClient.publish(channel, message);
    console.log('published')
  }

  async setExpirable(key: string, value:string, expiryInHours: number) {
    await this.redisClient.set(key, value, "EX", expiryInHours*60*60);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async delete(key: string) {
    await this.redisClient.del(key);
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (channel, message) =>{
        console.log('messages', message);
         callback(message)
    });
  }
}
