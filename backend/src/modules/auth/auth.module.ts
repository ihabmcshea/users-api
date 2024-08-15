import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RedisModule } from '../redis/redis.module';
import { PrismaService } from '../database/prisma.service'; // Ensure the PrismaService is available
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
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
  providers: [AuthService, JwtStrategy, PrismaService], // Provide AuthService and JwtStrategy
  controllers: [AuthController], // Register AuthController
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
