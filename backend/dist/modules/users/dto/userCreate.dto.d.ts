import { RegisterDto } from 'src/modules/auth/dto/register.dto';
export declare class UserCreateDto extends RegisterDto {
  verified?: boolean;
  role?: string;
}
