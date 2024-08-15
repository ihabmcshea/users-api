import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    verifyEmail(token: string): Promise<string>;
}
