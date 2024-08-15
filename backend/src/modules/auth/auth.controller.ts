import { Controller, Post, Body, Get, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserResponseDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user : UserResponseDto = await this.authService.register(registerDto);
    return user;
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in', schema: { example: { access_token: 'jwt-token-here' } } })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (user) {
      return this.authService.login(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<string> {
    const isVerified = await this.authService.verifyEmail(token);
    if (isVerified) {
      return 'Email successfully verified';
    }
    throw new UnauthorizedException('Email verification failed');
  }

  // @UseGuard()
  // @Get('my-profile')
  // async verifyEmail(@Query('token') token: string): Promise<string> {
  //   const isVerified = await this.authService.verifyEmail(token);
  //   if (isVerified) {
  //     return 'Email successfully verified';
  //   }
  //   throw new UnauthorizedException('Email verification failed');
  // }
}
