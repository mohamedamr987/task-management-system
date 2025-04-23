import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/enums/user-role.enum';
import { Request } from 'express';

export const CheckIfUserAndAddId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) {
      throw new Error('User not found in request');
    }

    const task = request.body as CreateTaskDto;

    if (user.role === UserRole.USER) {
      task.userId = user.id;
    }

    return task;
  },
);
