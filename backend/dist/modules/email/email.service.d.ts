import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { RedisService } from '../redis/redis.service';
export declare class EmailService implements OnModuleInit {
    private readonly redisService;
    private readonly mailerService;
    private readonly configService;
    constructor(redisService: RedisService, mailerService: MailerService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    handleEmailVerification(message: string): Promise<void>;
}
