import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { PaginatedUserDto } from './dto/paginatedUser.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiResponse({ status: 200, description: 'User details', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Req() req): Promise<UserDto> {
    try {
      const userId = req.user.userId;
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserDto(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw new HttpException(
        'Unable to retrieve user. Please check the user ID and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('profile')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Req() req, @Body() data: UpdateProfileDto): Promise<UserDto> {
    try {
      const userId = req.user.userId;
      const user = await this.usersService.updateUser(userId, data);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserDto(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new HttpException(
        'Unable to update profile. Please check the input data and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('admin')
  @Post()
  @ApiBody({ type: UserCreateDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createUser(@Body() data: UserCreateDto): Promise<UserDto> {
    try {
      const user = await this.usersService.createUser(data);
      return new UserDto(user);
    } catch (error) {
      console.log('error', JSON.stringify(error.response.message));
      if (error.response) {
        throw new HttpException({ message: error.response.message }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Unable to create user. Please check the input data and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('admin')
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results per page', example: 10 })
  @ApiResponse({ status: 200, description: 'List of users', type: PaginatedUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<PaginatedUserDto> {
    try {
      return await this.usersService.findAll(page, limit);
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new HttpException('Unable to retrieve users. Please try again later.', HttpStatus.BAD_REQUEST);
    }
  }

  @Roles('admin')
  @Get(':id')
  @ApiResponse({ status: 200, description: 'User details', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserDto(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw new HttpException(
        'Unable to retrieve user. Please check the user ID and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('admin')
  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<UserDto> {
    console.log('data', data);
    try {
      const user = await this.usersService.updateUser(id, data);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserDto(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpException(
        'Unable to update user. Please check the input data and try again.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('admin')
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    console.log('id', id);
    try {
      const user = await this.usersService.deleteUser(id);
      console.log(user);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserDto(user);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new HttpException('Unable to delete user. Please try again later.', HttpStatus.BAD_REQUEST);
    }
  }
}
