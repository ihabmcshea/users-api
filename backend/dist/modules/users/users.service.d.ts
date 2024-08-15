import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { UserDto } from './dto/user.dto';
import { PaginatedUserDto } from './dto/paginatedUser.dto';
import { UserCreateDto } from './dto/userCreate.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: UserCreateDto): Promise<UserDto>;
    findAll(page?: number, limit?: number): Promise<PaginatedUserDto>;
    findOne(id: number): Promise<UserDto>;
    findByEmail(email: string): Promise<UserDto>;
    updateUser(id: number, data: UpdateUserDto): Promise<UserDto>;
    deleteUser(id: number): Promise<UserDto>;
}
