import { Injectable, OnModuleInit } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  public httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
  });

  // This array simulates a memory leak by continuously storing data.
  private memoryLeakArray: string[] = [];

  onModuleInit() {
    promClient.collectDefaultMetrics();
  }

  incrementHttpRequests() {
    this.httpRequestsTotal.inc();
    this.memoryLeakArray.push('leak-' + Math.random());
  }
}
