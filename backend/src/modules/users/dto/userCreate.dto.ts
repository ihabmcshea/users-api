import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

export class UserCreateDto extends RegisterDto {
  @IsOptional()
  @ApiProperty({
    description: 'Indicates whether the user’s email is verified',
    default: false,
    example: true,
  })
  @IsOptional()
  verified?: boolean;
  @ApiProperty({
    description: 'The role of the user',
    default: 'user',
    example: 'admin',
  })
  role?: string;
}
