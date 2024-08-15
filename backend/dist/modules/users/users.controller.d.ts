import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { PaginatedUserDto } from './dto/paginatedUser.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(data: UserCreateDto): Promise<UserDto>;
    findAll(page?: number, limit?: number): Promise<PaginatedUserDto>;
    findOne(id: number): Promise<UserDto>;
    updateUser(id: number, data: UpdateUserDto): Promise<UserDto>;
    deleteUser(id: number): Promise<UserDto>;
}
