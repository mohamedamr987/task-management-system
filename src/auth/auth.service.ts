import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await argon2.hash(createUserDto.password);
    createUserDto.password = hashedPassword;
    let user = await this.userService.create(createUserDto);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }
    //remove password from user object before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    user = userWithoutPassword as User;
    // Generate access token for the user
    const accessToken = await this.generateAccessToken(user.id);
    const userWithToken = { ...user, accessToken };
    return userWithToken;
  }

  async login(userId: number): Promise<{ user: User; accessToken: string }> {
    const accessToken = await this.generateAccessToken(userId);
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user, accessToken };
  }

  async generateAccessToken(userId: number): Promise<string> {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        '7sFHZrGLIMIwTotAEyNS/j4yUEW7OtYmGebnAKWQOBJ/kB+ur4XnGt1oxnRC9HUOUK+hBfcOmqw+BmlgXFB4zRzte6LRqvXlLrNiXO+REDKycfYBFywXtFQ65ZE0B5Z9EwFXaP29QysUSc2HxDeWIMzfl5nMYDj0TYHEYPJPs2Zb4hKNPIpHdA2e+8r6imFsD5C5vh0P3psnLTX8liWgkC+8ENf1YxiORqAMt9kQ9Ola7WSkaTKe6dqLKGHDMeICTw2YcCZ7+I9yT4Umgncqz78pAsBHDJPE/oFMtxw9/moCMoMH2D6dJ34R09OQ/gv8lwIjKZfBVGNsqxHW8vuppw==',
    });
    return accessToken;
  }

  async validateJwtUser(userId: number): Promise<User> {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
