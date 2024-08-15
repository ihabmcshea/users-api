import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    verifyEmail(token: string): Promise<string>;
    checkAuth(req: any): {
        status: string;
        message: string;
        refreshRequired: boolean;
        user: any;
    };
    refreshToken(req: any): Promise<{
        access_token: string;
        user: UserResponseDto;
    }>;
}
