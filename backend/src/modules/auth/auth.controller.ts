import { Controller, Post, Body, Get, Query, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { EmailVerifiedGuard } from 'src/common/guards/email-verified.guard';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserResponseDto })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    const user: UserResponseDto = await this.authService.register(registerDto);
    return user;
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: { example: { access_token: 'jwt-token-here' } },
  })
  @UseGuards(EmailVerifiedGuard)
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

  @Get('check-auth')
  checkAuth(@Req() req) {
    // refreshRequired
    const token = req.headers.authorization?.split(' ')[1];

    return {
      status: 'success',
      message: 'User is authenticated',
      refreshRequired: false,
      user: req.user, // You can return the user info if needed
    };
  }

  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User is not logged in');
    }
    return this.authService.login(user);
  }
}
