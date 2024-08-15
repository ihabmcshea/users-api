import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database/prisma.service'; // Use PrismaService instead of PrismaClient directly
import { RedisService } from '../redis/redis.service';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService, // Inject PrismaService instead of creating a new instance
  ) {}

  /**
   * Registers a new user, hashes their password, and sends a verification token via Redis pub/sub.
   * @param data - The registration data.
   * @returns The created user.
   * @throws BadRequestException if registration fails.
   */
  async register(data: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName } = data;

    // Hash the user's password
    try {
      // Create the user
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

      // Generate a verification token and save it in Redis with expiration
      const verificationToken = uuidv4();
      await this.redisService.setExpirable(verificationToken, createdUser.id.toString(), 600); // 10 minutes expiration

      // Publish the verification token to a Redis channel
      const message = JSON.stringify({
        name: createdUser.firstName,
        email: createdUser.email,
        token: verificationToken,
      });
      await this.redisService.publish('email_verification', message);

      return createdUser;
    } catch (error) {
      console.error('Error during user registration:', error);
      throw new BadRequestException('Unable to register user. Please check the input data.');
    }
  }

  /**
   * Validates a user's email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The user if credentials are valid, otherwise null.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { email } });
      if (user && (await this.comparePassword(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      throw new BadRequestException('Invalid email or password.');
    }
  }

  /**
   * Logs in a user and generates a JWT token.
   * @param user - The user to log in.
   * @returns An object containing the access token.
   */
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Hashes a password using bcrypt.
   * @param password - The password to hash.
   * @returns The hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a password with a hashed password.
   * @param password - The plain password.
   * @param hash - The hashed password.
   * @returns True if passwords match, otherwise false.
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Verifies the user's email using a verification token.
   * @param token - The verification token.
   * @returns True if the email is successfully verified, otherwise false.
   * @throws UnauthorizedException if the token is invalid or expired.
   */
  async verifyEmail(token: string): Promise<boolean> {
    try {
      const userId = await this.redisService.get(token);
      if (!userId) {
        throw new UnauthorizedException('Invalid or expired verification token.');
      }

      const user = await this.prismaService.user.update({
        where: { id: Number(userId) },
        data: { verified: true },
      });

      await this.redisService.delete(token); // Clean up the token after successful verification

      return !!user;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new UnauthorizedException('Invalid verification token.');
    }
  }
}
