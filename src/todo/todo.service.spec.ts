import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoStatusEnum } from './models/todo-status.enum';
import { TodoDto } from './models/todo.dto';
import { Todo } from './models/todo.entity';
import { TodoService } from './todo.service';


const test_todo: Todo = {
  id :1,
  title: 'Test Title',
  body: 'Test Body',
  status: TodoStatusEnum.PENDING
};

const test_todo_dto: TodoDto = {
  id:0,
  title: 'Test Title',
  body: 'Test Body',
};

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            find: jest.fn().mockResolvedValue([test_todo]),
            findOne: jest.fn().mockResolvedValue(test_todo),
            save: jest.fn().mockResolvedValue(test_todo),
            delete: jest.fn().mockResolvedValue(undefined),
          }
        }
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should increment get counter', async () => {
      const todo = await service.findAll(); 
      expect(todo).toEqual([test_todo]);
    });
  });

  describe('add', () => {
    it('should increment get counter', async () => {
      const todo = await service.add(test_todo_dto); 
      expect(todo).toEqual(test_todo);
    });
  });

  describe('findOne', () => {
    it('should increment get counter', async () => {
      const todo = await service.findOne(test_todo.id.toString()); 
      expect(todo).toEqual(test_todo);
    });
  });

  describe('delete', () => {
    it('should increment get counter', async () => {
      const result = await service.delete(test_todo.id); 
      expect(result).toEqual(undefined);
    });
  });

});
