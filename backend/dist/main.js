"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const global_config_1 = require("./configs/global.config");
const app_module_1 = require("./modules/app/app.module");
const prismaClientException_filter_1 = require("./modules/filter/prismaclientexceptionfilter/prismaClientException.filter");
const global_constants_1 = require("./shared/constants/global.constants");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn'],
    });
    app.setGlobalPrefix(global_constants_1.API_PREFIX);
    app.useGlobalFilters(new prismaClientException_filter_1.PrismaClientExceptionFilter());
    app.use((0, cors_1.default)({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const configService = app.get(config_1.ConfigService);
    const swaggerConfig = configService.get('swagger');
    if (swaggerConfig && swaggerConfig.enabled) {
        const options = new swagger_1.DocumentBuilder()
            .setTitle(swaggerConfig.title || 'User Registration API')
            .setDescription(swaggerConfig.description || 'The User Registration API description')
            .setVersion(swaggerConfig.version || '1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
    }
    else {
        console.warn('Swagger is disabled or the configuration is missing.');
    }
    const PORT = process.env.BACKEND_PORT || global_config_1.GLOBAL_CONFIG.nest.port;
    await app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map