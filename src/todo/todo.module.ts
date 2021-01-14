import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo } from './models/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsModule } from '../metrics/metrics.module';
import { MetricsService } from '../metrics/metrics.service';
import { Metrics } from '../metrics/metrics.entity';
import { CounterMiddleware } from '../metrics/counter.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Metrics]), MetricsModule],
  providers: [TodoService, MetricsService],
  controllers: [TodoController],
})
export class TodoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CounterMiddleware).forRoutes(TodoController);
  }
}
