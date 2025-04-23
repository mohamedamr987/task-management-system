import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Task extends BaseEntity {
  @IsString()
  @Column()
  name: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  description: string;

  @IsDate()
  @Column()
  dueDate: Date;

  @IsEnum(TaskStatus)
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
