import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let prismaService: PrismaService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should register a user successfully', async () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    const mockUser: User = {
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

    const mockUser: User = {
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
    const user: User = {
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
