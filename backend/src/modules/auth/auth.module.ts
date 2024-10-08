import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '../database/prisma.service'; // Ensure the PrismaService is available
import { RedisModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(), // Load environment variablesgit remote add origin git@github.com:ihabmcshea/users-api.git
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with JWT as the default strategy
    RedisModule, // Import RedisModule for Redis interactions
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access configuration
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, UsersService, JwtStrategy, PrismaService], // Provide AuthService and JwtStrategy
  controllers: [AuthController], // Register AuthController
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
