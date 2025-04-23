import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    example: 'Mohamed Amr',
    description: 'User name',
    required: true,
  })
  @IsString({})
  @Column()
  name: string;

  @ApiProperty({
    example: 'email@gmail.com',
    required: true,
    description: 'User email',
  })
  @IsEmail()
  @IsString()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Column()
  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password',
    required: true,
  })
  @Exclude()
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
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Task, (task) => task.userId, { nullable: true })
  tasks: Task[];
}
