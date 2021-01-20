import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  async getMetrics(): Promise<any> {
    const metrics = await this.metricsService.getMetrics();
    delete metrics.id;
    return {
      http_requests_total:
        metrics.getCount +
        metrics.deleteCount +
        metrics.postCount +
        metrics.putCount,
    };
  }
}
