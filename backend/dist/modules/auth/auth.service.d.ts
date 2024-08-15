import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { RedisService } from '../redis/redis.service';
import { User } from '@prisma/client';
export declare class AuthService {
    private readonly jwtService;
    private readonly redisService;
    private readonly prismaService;
    constructor(jwtService: JwtService, redisService: RedisService, prismaService: PrismaService);
    register(data: RegisterDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    private hashPassword;
    private comparePassword;
    verifyEmail(token: string): Promise<boolean>;
}
