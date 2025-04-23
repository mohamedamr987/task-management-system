// src/common/decorators/api-pagination.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function SwaggerPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (1 based)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page',
      example: 10,
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: String,
      description: 'Sort field',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      type: String,
      description: 'Sort order (asc or desc)',
      example: 'asc',
    }),
    ApiQuery({
      name: 'filter',
      required: false,
      type: String,
      description: 'Filter field',
    }),
  );
}
