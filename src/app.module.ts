import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    TodoModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOSTNAME || 'localhost',
      port: +process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'todo-app',
      password: process.env.DB_PASSWORD || '0000',
      database: process.env.DB_NAME || 'todo',
      entities: ['dist/**/*.entity.js', 'dist/**/**/*.entity.js'],
      synchronize: true,
    }),
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
