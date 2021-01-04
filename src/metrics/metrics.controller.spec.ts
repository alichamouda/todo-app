import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { Metrics } from './metrics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('MetricsController', () => {
  let controller: MetricsController;
  let service: MetricsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: {
            getMetrics: jest.fn().mockResolvedValueOnce(new Metrics()),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<MetricsService>(MetricsService);
    controller = moduleRef.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return empty metrics', async () => {
      await expect(controller.getMetrics()).resolves.toEqual(new Metrics());
    });
  });
});
