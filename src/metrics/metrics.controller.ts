import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  async getMetrics(): Promise<any> {
    const metrics = await this.metricsService.getMetrics();
    delete metrics.id;
    return `http_requests_total{handler="todo",method="get"} ${metrics.getCount}\n
            http_requests_total{handler="todo",method="post"} ${metrics.postCount}\n
            http_requests_total{handler="todo",method="put"} ${metrics.putCount}\n
            http_requests_total{handler="todo",method="delete"} ${metrics.deleteCount}\n`;
  }
}
