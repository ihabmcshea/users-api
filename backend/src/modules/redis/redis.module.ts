import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.register({
      store: redisStore as any,
      host: process.env.REDIS_HOST || 'localhost',       // Redis host
      port: Number(process.env.REDIS_PORT)|| 6379,             // Redis port
    }),
  ],
  exports: [NestCacheModule, RedisService],
  providers: [RedisService],
})
export class RedisModule {}
