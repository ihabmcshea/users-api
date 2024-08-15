import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { RedisModule } from '../redis/redis.module';

import { EmailService } from './email.service';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mailHost = configService.get<string>('MAIL_HOST');
        const mailPort = configService.get<number>('MAIL_PORT');
        const mailUser = configService.get<string>('MAIL_USER');
        const mailPass = configService.get<string>('MAIL_PASS');
        const mailFrom = configService.get<string>('MAIL_FROM');

        // Validate essential environment variables
        if (!mailHost || !mailPort || !mailUser || !mailPass || !mailFrom) {
          throw new Error('Mail configuration is missing essential environment variables');
        }

        return {
          transport: {
            host: mailHost,
            port: mailPort,
            secure: false, // Set to true if using a secure transport (e.g., TLS/SSL)
            auth: {
              user: mailUser,
              pass: mailPass,
            },
            logger: true,
            debug: true,
          },
          defaults: {
            from: mailFrom,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
