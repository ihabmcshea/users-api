import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { GLOBAL_CONFIG } from '../../configs/global.config';
import { AppService } from './app.service';
import { AppController } from './app.controller';

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
      useFactory: () => ({
        store: redisStore,
        url: process.env.REDIS_URL,  // Ensure you set REDIS_URL in your environment variables
      } as RedisClientOptions),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware here if needed
    consumer.apply().forRoutes('*');
  }
}
