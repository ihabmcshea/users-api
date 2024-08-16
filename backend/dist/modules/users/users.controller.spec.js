"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const prisma_service_1 = require("../database/prisma.service");
const paginatedUser_dto_1 = require("./dto/paginatedUser.dto");
const user_dto_1 = require("./dto/user.dto");
const users_service_1 = require("./users.service");
describe('UsersService', () => {
    let service;
    let prismaService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [users_service_1.UsersService, { provide: prisma_service_1.PrismaService, useValue: mockPrismaService }],
        }).compile();
        service = module.get(users_service_1.UsersService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createUser', () => {
        it('should create a user', async () => {
            const createUserDto = {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'password',
                role: 'user',
                verified: false,
            };
            const result = await service.createUser(createUserDto);
            expect(result).toEqual(new user_dto_1.UserDto(mockUser));
            expect(prismaService.user.create).toHaveBeenCalledWith({ data: createUserDto });
        });
        it('should throw an error if user creation fails', async () => {
            jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error('Error'));
            const createUserDto = {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: 'password',
                role: 'user',
                verified: false,
            };
            await expect(service.createUser(createUserDto)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('findAll', () => {
        it('should return a paginated list of users', async () => {
            const result = await service.findAll(1, 10);
            expect(result).toEqual(new paginatedUser_dto_1.PaginatedUserDto([new user_dto_1.UserDto(mockUser)], 1, 1, 10));
            expect(prismaService.user.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });
        });
    });
    describe('findOne', () => {
        it('should return a user by ID', async () => {
            const result = await service.findOne(1);
            expect(result).toEqual(new user_dto_1.UserDto(mockUser));
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });
        it('should throw a NotFoundException if user is not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('updateUser', () => {
        it('should update a user', async () => {
            const updateUserDto = { firstName: 'Jane' };
            const updatedUser = { ...mockUser, firstName: 'Jane' };
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
            jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);
            const result = await service.updateUser(1, updateUserDto);
            expect(result).toEqual(new user_dto_1.UserDto(updatedUser));
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { firstName: 'Jane' },
            });
        });
        it('should throw a NotFoundException if user is not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
            await expect(service.updateUser(999, { firstName: 'Jane' })).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
            const deletedUser = { ...mockUser, id: 1 };
            jest.spyOn(prismaService.user, 'delete').mockResolvedValue(deletedUser);
            const result = await service.deleteUser(1);
            expect(result).toEqual(new user_dto_1.UserDto(deletedUser));
            expect(prismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
        it('should throw a NotFoundException if user is not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
            await expect(service.deleteUser(999)).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=users.controller.spec.js.map