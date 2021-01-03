import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Todo } from './models/todo.entity';
import { TodoStatusEnum } from './models/todo-status.enum';
import { TodoDto } from './models/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async add(todoDto: TodoDto): Promise<Todo> {
    const todo: Todo = new Todo(
      todoDto.title,
      todoDto.body,
      TodoStatusEnum.PENDING,
    );
    return await this.todoRepository.save(todo);
  }

  findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }

  async updateStatus(id: number, newStatus: TodoStatusEnum): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(Todo)
      .set({ status: newStatus })
      .where('id = :id', { id: id })
      .execute();
  }


}
