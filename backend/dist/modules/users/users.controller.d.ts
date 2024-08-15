import { PaginatedUserDto } from './dto/paginatedUser.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UpdateUserDto } from './dto/userUpdate.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<UserDto>;
    updateProfile(req: any, data: UpdateProfileDto): Promise<UserDto>;
    createUser(data: UserCreateDto): Promise<UserDto>;
    findAll(page?: number, limit?: number): Promise<PaginatedUserDto>;
    findOne(id: number): Promise<UserDto>;
    updateUser(id: number, data: UpdateUserDto): Promise<UserDto>;
    deleteUser(id: number): Promise<UserDto>;
}
