import { CacheModule } from '@nestjs/cache-manager';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

import { GLOBAL_CONFIG } from '../../configs/global.config';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => GLOBAL_CONFIG],
    }),
    DatabaseModule,
    AuthModule,
    EmailModule,
    UsersModule,
    CacheModule.registerAsync({
      useFactory: () =>
        ({
          store: redisStore,
          url: process.env.REDIS_URL,
        } as RedisClientOptions),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
