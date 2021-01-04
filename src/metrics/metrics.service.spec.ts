import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from 'src/todo/models/todo.entity';
import { Repository } from 'typeorm';
import { Metrics } from './metrics.entity';
import { MetricsService } from './metrics.service';

const test_metrics : Metrics = {
  id :1,
  getCount : 0,
  postCount : 0,
  putCount : 0,
  deleteCount: 0
};


describe('MetricsService', () => {
  let service: MetricsService;
  let repository: Repository<Metrics>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
      {
        provide: getRepositoryToken(Metrics),
        useValue: {
          findOne: jest.fn().mockResolvedValue(test_metrics),
          save: jest.fn().mockResolvedValue(test_metrics),
        }
      }
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    repository = module.get<Repository<Metrics>>(getRepositoryToken(Metrics));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('incrementGet', () => {
    it('should increment get counter', async () => {
      const metrics = await service.incrementGet(); 
      expect(metrics.getCount).toEqual(1);
    });
  });

  describe('incrementPost', () => {
    it('should increment post counter', async () => {
      const metrics = await service.incrementPost(); 
      expect(metrics.postCount).toEqual(1);
    });
  });

  describe('incrementPut', () => {
    it('should increment put counter', async () => {
      const metrics = await service.incrementPut(); 
      expect(metrics.putCount).toEqual(1);
    });
  });
  describe('incrementDelete', () => {
    it('should increment delete counter', async () => {
      const metrics = await service.incrementDelete(); 
      expect(metrics.deleteCount).toEqual(1);
    });
  });

  describe('getMetrics', () => {
    it('should get metrics', async () => {
      const metrics = await service.getMetrics(); 
      expect(metrics).toEqual(test_metrics);
    });
  });

  describe('initMetrics', () => {
    it('should init metrics', async () => {
      const metrics = await service.initMetrics(); 
      expect(metrics).toEqual(test_metrics);
    });
  });
});
