// user.controller.ts
import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
@ApiBearerAuth('JWT-auth') // Adds the auth lock icon and enables token input
@Controller('users')
export class UserController {
  constructor(public service: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Get()
  async findAll(@Body() data: Partial<CreateUserDto>) {
    return this.service.findAll(data);
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.service.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: Partial<CreateUserDto>) {
    return this.service.update(id, data);
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
