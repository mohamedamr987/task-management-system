import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Task name',
    description: 'Task name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Task description',
    description: 'Task description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'Task due date',
    required: true,
  })
  @IsString()
  dueDate: Date;

  @ApiProperty({
    example: '5',
    description: 'User ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  userId: number;
}
