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
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { PaginatedUserDto } from './dto/paginatedUser.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
      throw new HttpException('Unable to create user. Please check the input data and try again.', HttpStatus.BAD_REQUEST);
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
      throw new HttpException('Unable to retrieve user. Please check the user ID and try again.', HttpStatus.BAD_REQUEST);
    }
  }

  @Roles('admin')
  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      const user = await this.usersService.updateUser(id, data);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return new UserDto(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpException('Unable to update user. Please check the input data and try again.', HttpStatus.BAD_REQUEST);
    }
  }

  @Roles('admin')
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    try {
      const user = await this.usersService.deleteUser(id);
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
