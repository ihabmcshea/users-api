"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./email.service");
const redis_module_1 = require("../redis/redis.module");
const path_1 = require("path");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            redis_module_1.RedisModule,
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const mailHost = configService.get('MAIL_HOST');
                    const mailPort = configService.get('MAIL_PORT');
                    const mailUser = configService.get('MAIL_USER');
                    const mailPass = configService.get('MAIL_PASS');
                    const mailFrom = configService.get('MAIL_FROM');
                    if (!mailHost || !mailPort || !mailUser || !mailPass || !mailFrom) {
                        throw new Error('Mail configuration is missing essential environment variables');
                    }
                    return {
                        transport: {
                            host: mailHost,
                            port: mailPort,
                            secure: false,
                            auth: {
                                user: mailUser,
                                pass: mailPass,
                            },
                            logger: true,
                            debug: true,
                        },
                        template: {
                            dir: (0, path_1.join)(process.cwd(), 'src/modules/email/templates/'),
                            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                            options: {
                                strict: true,
                            },
                        },
                        defaults: {
                            from: mailFrom,
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [email_service_1.EmailService],
        exports: [email_service_1.EmailService],
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map