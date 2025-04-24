import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: +(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || 'myuser',
      password: process.env.DATABASE_PASSWORD || 'mypassword',
      database: process.env.DATABASE_NAME || 'mydatabase',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UserModule,
    TaskModule,
  ],
})
export class AppModule {}
