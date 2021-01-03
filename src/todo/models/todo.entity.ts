import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TodoStatusEnum } from './todo-status.enum';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  body: string;
  @Column({ default: TodoStatusEnum.PENDING })
  status: string;

  constructor(title: string, body: string, status: string) {
    this.title = title;
    this.body = body;
    this.status = status;
  }
}
