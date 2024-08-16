import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginatedUserDto } from './dto/paginatedUser.dto';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
export declare class UsersService {
    private readonly redisService;
    private readonly prisma;
    constructor(redisService: RedisService, prisma: PrismaService);
    createUser(data: UserCreateDto): Promise<UserDto>;
    findAll(page?: number, limit?: number): Promise<PaginatedUserDto>;
    findOne(id: number): Promise<UserDto>;
    findByEmail(email: string): Promise<UserDto>;
    updateUser(id: number, data: UpdateUserDto): Promise<UserDto>;
    deleteUser(id: number): Promise<UserDto>;
}
