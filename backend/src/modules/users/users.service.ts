import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

import { PaginatedUserDto } from './dto/paginatedUser.dto';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';

@Injectable()
export class UsersService {
  constructor(private readonly redisService: RedisService, private readonly prisma: PrismaService) {}

  /**
   * Creates a new user with the provided data.
   * @param data - The data to create the user.
   * @returns The created user.
   * @throws BadRequestException if the user cannot be created.
   */
  async createUser(data: UserCreateDto): Promise<UserDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      console.log('existingUser', existingUser);
      if (existingUser) {
        throw new BadRequestException({
          email: 'This email is already registered.',
        });
      }

      const userData = {
        ...data,
        verified: data.verified !== undefined ? data.verified : false,
        role: data.role || 'user',
      };
      const user = await this.prisma.user.create({ data: userData });
      const verificationToken = uuidv4();
      await this.redisService.setExpirable(verificationToken, user.id.toString(), 600); // 10 minutes expiration

      // Publish the verification token to a Redis channel
      const message = JSON.stringify({
        name: user.firstName,
        email: user.email,
        token: verificationToken,
      });
      await this.redisService.publish('email_verification', message);

      return new UserDto(user);
    } catch (error) {
      throw new BadRequestException({ message: 'email: This email is already registered' });
    }
  }

  /**
   * Retrieves a paginated list of users.
   * @param page - The page number (default is 1).
   * @param limit - The number of results per page (default is 10).
   * @returns A paginated list of users.
   * @throws BadRequestException if users cannot be retrieved.
   */
  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedUserDto> {
    const skip = (page - 1) * limit;

    try {
      const [users, totalCount] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
        }),
        this.prisma.user.count(),
      ]);

      return new PaginatedUserDto(
        users.map((user) => new UserDto(user)),
        totalCount,
        page,
        limit,
      );
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new BadRequestException('Unable to retrieve users. Please try again later.');
    }
  }

  /**
   * Retrieves a single user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the specified ID.
   * @throws NotFoundException if the user does not exist.
   */
  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserDto(user);
  }

  /**
   * Retrieves a single user by their email address.
   * @param email - The email of the user to retrieve.
   * @returns The user with the specified ID.
   * @throws NotFoundException if the user does not exist.
   */
  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`Email ${email} not found`);
    }

    return new UserDto(user);
  }

  /**
   * Updates a user's information.
   * @param id - The ID of the user to update.
   * @param data - The data to update the user with.
   * @returns The updated user.
   * @throws NotFoundException if the user does not exist.
   * @throws BadRequestException if the user cannot be updated.
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<UserDto> {
    // console.log('data', data);
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Filter out any empty properties from the update data
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: filteredData,
      });

      return new UserDto(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new BadRequestException('Unable to update user. Please check the input data and try again.');
    }
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns The deleted user.
   * @throws NotFoundException if the user does not exist.
   * @throws BadRequestException if the user cannot be deleted.
   */
  async deleteUser(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    try {
      const deletedUser = await this.prisma.user.delete({ where: { id } });
      return new UserDto(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new BadRequestException('Unable to delete user. Please try again later.');
    }
  }
}
