import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metrics } from './metrics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Metrics])],
  providers: [MetricsService],
  controllers: [MetricsController],
})
export class MetricsModule {
}
