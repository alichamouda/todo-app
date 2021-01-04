import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Metrics } from './metrics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetricsService implements OnModuleInit {
  constructor(
    @InjectRepository(Metrics) private metricsRepository: Repository<Metrics>,
  ) {
  }

  async incrementGet(): Promise<Metrics> {
    const metrics = await this.metricsRepository.findOne();
    metrics.getCount = metrics.getCount + 1;
    return await this.metricsRepository.save(metrics);
  }

  async incrementPost(): Promise<Metrics> {
    const metrics = await this.metricsRepository.findOne();
    metrics.postCount = metrics.postCount + 1;
    return await this.metricsRepository.save(metrics);
  }

  async incrementPut(): Promise<Metrics> {
    const metrics = await this.metricsRepository.findOne();
    metrics.putCount = metrics.putCount + 1;
    return await this.metricsRepository.save(metrics);
  }

  async incrementDelete(): Promise<Metrics> {
    const metrics = await this.metricsRepository.findOne();
    metrics.deleteCount = metrics.deleteCount + 1;
    return await this.metricsRepository.save(metrics);
  }

  async getMetrics(): Promise<Metrics> {
    return await this.metricsRepository.findOne();
  }

  async initMetrics(): Promise<Metrics> {
    return await this.metricsRepository.save(new Metrics());
  }

  async onModuleInit(): Promise<any> {
    const metrics = await this.metricsRepository.find();
    if (metrics.length == 0) {
      return await this.initMetrics();
    }
  }
}
