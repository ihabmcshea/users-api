import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../modules/users/users.service';
export declare class EmailVerifiedGuard implements CanActivate {
  private reflector;
  private readonly usersService;
  constructor(reflector: Reflector, usersService: UsersService);
  canActivate(context: ExecutionContext): Promise<boolean>;
}
