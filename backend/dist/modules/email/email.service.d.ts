import { OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare class EmailService implements OnModuleInit {
    private readonly redisService;
    private readonly mailerService;
    private readonly configService;
    constructor(redisService: RedisService, mailerService: MailerService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    handleEmailVerification(message: string): Promise<void>;
}
