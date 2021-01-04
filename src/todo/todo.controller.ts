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
import { MetricsService } from '../metrics/metrics.service';

@Controller('api/todo')
export class TodoController {
  constructor(
    private todoService: TodoService,
    private metricsService: MetricsService,
  ) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    await this.metricsService.incrementGet();
    return await this.todoService.findAll();
  }

  @Post()
  async add(@Body() todoDto: TodoDto): Promise<Todo> {
    await this.metricsService.incrementPost();
    return await this.todoService.add(todoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.metricsService.incrementDelete();
    return await this.todoService.delete(id);
  }

  @Put(':id')
  async setStatus(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    await this.metricsService.incrementPut();
    return await this.todoService.updateStatus(id, updateTodoDto.status);
  }
}
