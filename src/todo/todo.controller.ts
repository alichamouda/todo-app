import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Todo } from './models/todo.entity';
import { TodoDto } from './models/todo.dto';
import { UpdateTodoDto } from './models/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return await this.todoService.findAll();
  }

  @Post()
  async add(@Body() todoDto: TodoDto): Promise<Todo> {
    return await this.todoService.add(todoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.todoService.delete(id);
  }

  @Put(':id')
  async setStatus(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.updateStatus(id, updateTodoDto.status);
  }
}
