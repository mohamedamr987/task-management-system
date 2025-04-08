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
    const user = await this.userService.create(createUserDto);
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const accessToken = await this.generateAccessToken(user.id);
    const userWithToken = { ...user, accessToken };
    return userWithToken;
  }

  async login(userId: number): Promise<{ user: User; accessToken: string }> {
    const accessToken = await this.generateAccessToken(userId);
    const user = await this.userService.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user, accessToken };
  }

  async generateAccessToken(userId: number): Promise<string> {
    const payload: AuthJwtPayload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return accessToken;
  }

  async validateJwtUser(userId: number): Promise<User> {
    const user = await this.userService.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
