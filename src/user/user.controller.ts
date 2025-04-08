// user.controller.ts
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Crud({
  model: { type: User },
  dto: {
    create: 'CreateUserDto',
    update: 'UpdateUserDto',
  },
  query: {
    limit: 10,
    maxLimit: 100,
    cache: 2000,
    filter: { age: { $gt: 18 } }, // Default filter
  },
})
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(public service: UserService) {}
}
