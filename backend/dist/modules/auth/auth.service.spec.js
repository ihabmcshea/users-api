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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
const prisma_service_1 = require("../database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
}));
describe('AuthService', () => {
    let service;
    let jwtService;
    let redisService;
    let prismaService;
    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockedAccessToken'),
    };
    const mockRedisService = {
        setExpirable: jest.fn(),
        publish: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
    };
    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: jwt_1.JwtService, useValue: mockJwtService },
                { provide: redis_service_1.RedisService, useValue: mockRedisService },
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        jwtService = module.get(jwt_1.JwtService);
        redisService = module.get(redis_service_1.RedisService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    it('should register a user successfully', async () => {
        const registerDto = {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
        };
        const mockUser = {
            id: 1,
            email: registerDto.email,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            password: await bcrypt.hash(registerDto.password, 10),
            role: 'user',
            verified: false,
            createdAt: new Date('2024-08-14T12:00:00Z'),
            updatedAt: new Date('2024-08-14T12:00:00Z'),
        };
        jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
        jest.spyOn(redisService, 'setExpirable').mockResolvedValue();
        jest.spyOn(redisService, 'publish').mockResolvedValue();
        const user = await service.register(registerDto);
        expect(user).toEqual(mockUser);
        expect(redisService.setExpirable).toHaveBeenCalledWith(expect.any(String), expect.any(String), 600);
        expect(redisService.publish).toHaveBeenCalledWith('email_verification', expect.any(String));
    });
    it('should validate a user successfully', async () => {
        const email = 'test@example.com';
        const password = 'password123';
        const mockUser = {
            id: 1,
            email,
            firstName: 'John',
            lastName: 'Doe',
            password: await bcrypt.hash(password, 10),
            role: 'user',
            verified: true,
            createdAt: new Date('2024-08-14T12:00:00Z'),
            updatedAt: new Date('2024-08-14T12:00:00Z'),
        };
        jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
        const user = await service.validateUser(email, password);
        expect(user).toEqual(mockUser);
    });
    it('should return an access token upon successful login', async () => {
        const user = {
            id: 1,
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'hashedPassword',
            role: 'user',
            verified: true,
            createdAt: new Date('2024-08-14T12:00:00Z'),
            updatedAt: new Date('2024-08-14T12:00:00Z'),
        };
        const result = await service.login(user);
        expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });
    it('should verify email successfully', async () => {
        const token = 'verificationToken';
        const userId = '1';
        jest.spyOn(redisService, 'get').mockResolvedValue(userId);
        jest.spyOn(prismaService.user, 'update').mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'hashedPassword',
            role: 'user',
            verified: true,
            createdAt: new Date('2024-08-14T12:00:00Z'),
            updatedAt: new Date('2024-08-14T12:00:00Z'),
        });
        jest.spyOn(redisService, 'delete').mockResolvedValue();
        const result = await service.verifyEmail(token);
        expect(result).toBe(true);
    });
});
//# sourceMappingURL=auth.service.spec.js.map