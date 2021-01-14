import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Injectable()
export class CounterMiddleware implements NestMiddleware {

  constructor(private metricsService: MetricsService) {}

  async use(req: any, res: any, next: () => void) {
    if (req.method == 'GET') {
      await this.metricsService.incrementGet();
    } else if (req.method == 'POST') {
      await this.metricsService.incrementPost();
    } else if (req.method == 'DELETE') {
      await this.metricsService.incrementDelete();
    } else if (req.method == 'PUT') {
      await this.metricsService.incrementPut();
    }
    next();
  }
}
