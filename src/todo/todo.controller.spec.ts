import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from '../metrics/metrics.service';
import { TodoStatusEnum } from './models/todo-status.enum';
import { TodoDto } from './models/todo.dto';
import { Todo } from './models/todo.entity';
import { TodoController } from './todo.controller';
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

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;
  let metrics_service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll:jest.fn().mockResolvedValueOnce([test_todo]),
            add: jest.fn().mockImplementation(
               (todoDto: TodoDto) => Promise.resolve(test_todo)),
            delete: jest.fn().mockResolvedValueOnce(undefined),
            updateStatus: jest.fn().mockResolvedValueOnce(undefined),
          }
        },
        {
          provide: MetricsService,
          useValue: {
            incrementPut:jest.fn().mockResolvedValueOnce(undefined),
            incrementGet:jest.fn().mockResolvedValueOnce(undefined),
            incrementPost:jest.fn().mockResolvedValueOnce(undefined),
            incrementDelete:jest.fn().mockResolvedValueOnce(undefined),
          }
        }
      ]
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
    metrics_service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('findAll', () => {
    it('should return 1 todo array', async () => {
      await expect(controller.findAll()).resolves.toEqual([test_todo]);
    });
  });

  describe('add', () => {
    it('should add one todo and return it', async () => {
      await expect(controller.add(test_todo_dto)).resolves.toEqual(test_todo);
    });
  });

  describe('delete', () => {
    it('should delete one todo', async () => {
      await expect(controller.delete(test_todo.id)).resolves.toEqual(undefined);
    });
  });

  describe('setStatus', () => {
    it('should set one todo status to value', async () => {
      await expect(controller
        .setStatus(test_todo.id, {status: TodoStatusEnum.DONE}))
        .resolves.toEqual(undefined);
    });
  });

});
