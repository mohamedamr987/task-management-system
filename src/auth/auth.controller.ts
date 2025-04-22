import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      example: {
        email: 'email@gmail.com',
        password: 'SecurePass123!',
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user.id);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiBody({
    schema: {
      example: {
        name: 'John Doe',
        email: 'email@gmail.com',
        password: 'SecurePass123!',
      },
    },
  })
  async signup(@Request() req) {
    const createUserDto = req.body as CreateUserDto;
    return this.authService.signUp(createUserDto);
  }
}
