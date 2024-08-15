"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const prisma_service_1 = require("../database/prisma.service");
const redis_service_1 = require("../redis/redis.service");
let AuthService = class AuthService {
    constructor(jwtService, redisService, prismaService) {
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.prismaService = prismaService;
    }
    async register(data) {
        const { email, password, firstName, lastName } = data;
        try {
            const createdUser = await this.prismaService.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    password,
                    role: 'user',
                    verified: false,
                },
            });
            const verificationToken = (0, uuid_1.v4)();
            await this.redisService.setExpirable(verificationToken, createdUser.id.toString(), 600);
            const message = JSON.stringify({
                name: createdUser.firstName,
                email: createdUser.email,
                token: verificationToken,
            });
            await this.redisService.publish('email_verification', message);
            return createdUser;
        }
        catch (error) {
            console.error('Error during user registration:', error);
            throw new common_1.BadRequestException('Unable to register user. Please check the input data.');
        }
    }
    async validateUser(email, password) {
        try {
            const user = await this.prismaService.user.findUnique({ where: { email } });
            if (user && (await this.comparePassword(password, user.password))) {
                return user;
            }
            return null;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid email or password.');
        }
    }
    async login(user) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async verifyEmail(token) {
        try {
            const userId = await this.redisService.get(token);
            if (!userId) {
                throw new common_1.UnauthorizedException('Invalid or expired verification token.');
            }
            const user = await this.prismaService.user.update({
                where: { id: Number(userId) },
                data: { verified: true },
            });
            await this.redisService.delete(token);
            return !!user;
        }
        catch (error) {
            console.error('Error verifying email:', error);
            throw new common_1.UnauthorizedException('Invalid verification token.');
        }
    }
    async refreshToken(token) {
        if (!token) {
            return {
                status: 'error',
                message: 'Token not provided',
            };
        }
        const decodedToken = this.jwtService.decode(token);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;
        const timeThreshold = 60 * 60 * 1000;
        if (timeLeft < timeThreshold) {
            return {
                refreshRequired: true,
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        redis_service_1.RedisService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map