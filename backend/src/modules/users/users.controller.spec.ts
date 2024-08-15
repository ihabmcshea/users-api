import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../database/prisma.service';

import { PaginatedUserDto } from './dto/paginatedUser.dto';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // Mock user data
  const mockUser = {
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

  // Mock PrismaService methods
  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue(mockUser),
      findMany: jest.fn().mockResolvedValue([mockUser]),
      count: jest.fn().mockResolvedValue(1),
      findUnique: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      delete: jest.fn().mockResolvedValue(mockUser),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: UserCreateDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        role: 'user',
        verified: false,
      };

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(new UserDto(mockUser));
      expect(prismaService.user.create).toHaveBeenCalledWith({ data: createUserDto });
    });

    it('should throw an error if user creation fails', async () => {
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error('Error'));

      const createUserDto: UserCreateDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        role: 'user',
        verified: false,
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      const result = await service.findAll(1, 10);
      expect(result).toEqual(new PaginatedUserDto([new UserDto(mockUser)], 1, 1, 10));
      expect(prismaService.user.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(new UserDto(mockUser));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, firstName: 'Jane' };

      // Mock PrismaService methods
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, updateUserDto);

      expect(result).toEqual(new UserDto(updatedUser));
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { firstName: 'Jane' },
      });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.updateUser(999, { firstName: 'Jane' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      // Mock findUnique to return the user that we are going to delete
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      // Mock delete method to return the deleted user
      const deletedUser = { ...mockUser, id: 1 };
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(deletedUser);

      const result = await service.deleteUser(1);

      // Expect the result to be the user DTO
      expect(result).toEqual(new UserDto(deletedUser));
      expect(prismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      // Mock findUnique to return null
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
    });
  });
});
