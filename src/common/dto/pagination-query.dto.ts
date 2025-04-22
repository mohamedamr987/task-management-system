// src/common/dto/pagination.dto.ts
import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Current page number',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number = 1;
}
