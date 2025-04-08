import { Entity } from 'typeorm';
import { BaseEntity } from 'src/entities/base.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({
    example: 'Mohamed Amr',
    description: 'User name',
    required: true,
  })
  @IsString({})
  name: string;

  @ApiProperty({
    example: 'email@gmail.com',
    required: true,
    description: 'User email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @Exclude()
  @IsString()
  password: string;

  // make the default value user
  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    required: false,
    description: 'User role',
  })
  role: UserRole;
}
