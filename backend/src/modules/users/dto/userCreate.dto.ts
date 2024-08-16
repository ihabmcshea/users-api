import { IsEmail, IsNotEmpty, IsString, Matches, IsIn, IsBoolean } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsIn(['user', 'admin'])
  role: 'user' | 'admin';

  @IsNotEmpty()
  @IsBoolean()
  verified?: boolean = false;
}
