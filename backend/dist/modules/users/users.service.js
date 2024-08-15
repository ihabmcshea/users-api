'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UsersService = void 0;
const common_1 = require('@nestjs/common');
const prisma_service_1 = require('../database/prisma.service');
const paginatedUser_dto_1 = require('./dto/paginatedUser.dto');
const user_dto_1 = require('./dto/user.dto');
let UsersService = class UsersService {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async createUser(data) {
    try {
      const userData = {
        ...data,
        verified: data.verified !== undefined ? data.verified : false,
        role: data.role || 'user',
      };
      const user = await this.prisma.user.create({ data: userData });
      return new user_dto_1.UserDto(user);
    } catch (error) {
      throw new common_1.BadRequestException('Unable to create user. Please check the input data and try again.');
    }
  }
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    try {
      const [users, totalCount] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
        }),
        this.prisma.user.count(),
      ]);
      return new paginatedUser_dto_1.PaginatedUserDto(
        users.map((user) => new user_dto_1.UserDto(user)),
        totalCount,
        page,
        limit,
      );
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new common_1.BadRequestException('Unable to retrieve users. Please try again later.');
    }
  }
  async findOne(id) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
    return new user_dto_1.UserDto(user);
  }
  async findByEmail(email) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new common_1.NotFoundException(`User with email ${email} not found`);
    }
    return new user_dto_1.UserDto(user);
  }
  async updateUser(id, data) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
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
      return new user_dto_1.UserDto(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new common_1.BadRequestException('Unable to update user. Please check the input data and try again.');
    }
  }
  async deleteUser(id) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new common_1.NotFoundException(`User with ID ${id} not found`);
    }
    try {
      const deletedUser = await this.prisma.user.delete({ where: { id } });
      return new user_dto_1.UserDto(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new common_1.BadRequestException('Unable to delete user. Please try again later.');
    }
  }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate(
  [(0, common_1.Injectable)(), __metadata('design:paramtypes', [prisma_service_1.PrismaService])],
  UsersService,
);
//# sourceMappingURL=users.service.js.map
