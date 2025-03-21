import { Controller, Get } from '@nestjs/common';
import * as promClient from 'prom-client';

@Controller('metrics')
export class MetricsController {
  @Get()
  getMetrics() {
    return promClient.register.metrics();
  }
}
