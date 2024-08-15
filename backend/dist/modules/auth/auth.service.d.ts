import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
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
