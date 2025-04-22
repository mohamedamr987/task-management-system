/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Patch,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../enums/user-role.enum';
import { AdminOrSameUser } from '../auth/decorators/admin-or-same-user.decorator';
import { SwaggerPagination } from '../common/decorators/swagger-pagination.decorator';
@ApiBearerAuth('JWT-auth') // Adds the auth lock icon and enables token input
@Controller('users')
export class UserController {
  constructor(public service: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    console.log(req.user); // Log the user object from the request
    const user = await this.service.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiQuery({
    name: 'email',
    required: false,
    type: 'string',
    description: 'Filter by user email',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: 'string',
    description: 'Filter by user name',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: 'string',
    enum: UserRole,
    description: 'Filter by user role',
  })
  @SwaggerPagination()
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({
    schema: {
      example: {
        name: 'Updated Name',
        email: 'updatedemail@gmailcom',
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() data: Partial<UpdateUserDto>,
    @AdminOrSameUser() _isAdminOrSameUser: boolean,
  ) {
    const { password, role, ...rest } = data; // Exclude password from the update
    return this.service.update(id, rest);
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
