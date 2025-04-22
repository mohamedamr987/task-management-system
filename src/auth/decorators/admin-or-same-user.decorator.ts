/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/decorators/admin-or-same-user.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../enums/user-role.enum';

export const AdminOrSameUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const paramId = Number(request.params.id);

    // Allow if admin
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Allow if same user
    if (user.id === paramId) {
      return true;
    }

    // Otherwise throw
    throw new ForbiddenException(
      'You must be an admin or the owner of this resource to perform this action',
    );
  },
);
