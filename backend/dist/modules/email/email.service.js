"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let EmailService = class EmailService {
    constructor(redisService, mailerService, configService) {
        this.redisService = redisService;
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async onModuleInit() {
        await this.redisService.subscribe('email_verification', this.handleEmailVerification.bind(this));
    }
    async handleEmailVerification(message) {
        try {
            const { email, name, token } = JSON.parse(message);
            if (!email || !name || !token) {
                throw new Error('Invalid message format for email verification');
            }
            await this.mailerService.sendMail({
                to: email,
                subject: 'Email Verification',
                template: './verification',
                context: {
                    name,
                    token,
                    email,
                    apiURL: this.configService.get("API_URL")
                },
            });
            console.log(`Verification email sent to ${email}`);
        }
        catch (error) {
            console.error('Failed to send verification email:', error.message);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        mailer_1.MailerService,
        config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map