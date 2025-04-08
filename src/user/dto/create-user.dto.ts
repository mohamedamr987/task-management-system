// create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Mohamed Amr',
    description: 'User name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'User email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password',
    required: true,
  })
  @IsString()
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    required: false,
    default: UserRole.USER,
    description: 'User role',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;
}
