/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SwaggerPagination } from 'src/common/decorators/swagger-pagination.decorator';
import { CheckIfUserAndAddId } from './decorators/check-if-user-and-add-id.decorator';
import { UserRole } from 'src/enums/user-role.enum';

@ApiTags('Task')
@ApiBearerAuth('JWT-auth') // Adds the auth lock icon and enables token input
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CheckIfUserAndAddId() _createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.create(_createTaskDto);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @SwaggerPagination()
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'User ID',
    example: 1,
  })
  @Get()
  findAll(@Query() query: any, @Request() req) {
    const user = req.user;
    if (user?.role === UserRole.USER) {
      query.userId = user.id.toString();
    }
    query.populate = ['user'];
    return this.taskService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOneById(+id);
  }

  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: CreateTaskDto,
    @Request() req,
  ) {
    const user = req.user;
    if (user?.role === UserRole.USER) {
      updateTaskDto.userId = user.id;
    }
    return this.taskService.update(+id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
