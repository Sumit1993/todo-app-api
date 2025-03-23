import {
  Injectable,
  OnModuleInit,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import * as promClient from 'prom-client';
import axios from 'axios';

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private readonly register: promClient.Registry;
  private readonly httpRequestDuration: promClient.Histogram;
  private readonly httpRequestsTotal: promClient.Counter;
  private pushgatewayUrl: string | null = null;
  private pushInterval: NodeJS.Timeout | null = null;
  private readonly logger = new Logger(MetricsService.name);

  constructor() {
    this.register = new promClient.Registry();
    promClient.collectDefaultMetrics({ register: this.register });

    // Create HTTP request duration histogram
    this.httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.register],
    });

    // Create HTTP requests total counter
    this.httpRequestsTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.register],
    });

    // Configure metrics push based on environment
    this.configurePushgateway();
  }

  private configurePushgateway() {
    // For cloud deployment with Grafana Cloud
    if (
      process.env.METRICS_PROVIDER === 'grafana' &&
      process.env.GRAFANA_PUSH_URL
    ) {
      this.pushgatewayUrl = process.env.GRAFANA_PUSH_URL;
      this.logger.log('Configured for Grafana Cloud metrics push');
    }
    // For local development with local Prometheus
    else if (
      process.env.METRICS_PROVIDER === 'local' &&
      process.env.LOCAL_PUSHGATEWAY_URL
    ) {
      this.pushgatewayUrl = process.env.LOCAL_PUSHGATEWAY_URL;
      this.logger.log('Configured for local Prometheus pushgateway');
    }
    // No metrics push configured
    else {
      this.logger.log(
        'No metrics push configured - running in metrics collection only mode',
      );
    }
  }

  onModuleInit() {
    // Setup push to Grafana Cloud if configured with authentication
    if (
      this.pushgatewayUrl &&
      process.env.METRICS_PROVIDER === 'grafana' &&
      process.env.GRAFANA_USERNAME &&
      process.env.GRAFANA_PASSWORD
    ) {
      this.setupGrafanaPush();
    }
    // Setup push to local Prometheus pushgateway (no auth required)
    else if (this.pushgatewayUrl && process.env.METRICS_PROVIDER === 'local') {
      this.setupLocalPush();
    }
  }

  onModuleDestroy() {
    this.stopSetInterval();
  }

  private setupGrafanaPush() {
    this.pushInterval = setInterval(() => {
      this.pushMetricsToGrafana();
    }, 15000);
  }

  private async pushMetricsToGrafana() {
    try {
      if (this.pushgatewayUrl) {
        const metrics = await this.register.metrics();
        await axios.post(this.pushgatewayUrl, metrics, {
          headers: {
            'Content-Type': 'text/plain',
            Authorization:
              'Basic ' +
              Buffer.from(
                `${process.env.GRAFANA_USERNAME}:${process.env.GRAFANA_PASSWORD}`,
              ).toString('base64'),
          },
        });
        this.logger.debug('Metrics pushed to Grafana Cloud');
      }
    } catch (error) {
      this.logger.error('Error pushing metrics to Grafana Cloud:', error);
    }
  }

  // Optional: Cleanup on service destruction
  public stopSetInterval() {
    if (this.pushInterval) {
      clearInterval(this.pushInterval);
    }
  }

  private setupLocalPush() {
    // Push metrics every 15 seconds to local Prometheus pushgateway
    this.pushInterval = setInterval(() => {
      this.pushMetricsToLocal();
    }, 15000);
  }

  private async pushMetricsToLocal() {
    try {
      if (this.pushgatewayUrl) {
        const metrics = await this.register.metrics();
        await axios.post(this.pushgatewayUrl, metrics, {
          headers: {
            'Content-Type': 'text/plain',
          },
        });
        this.logger.debug('Metrics pushed to local Prometheus pushgateway');
      }
    } catch (error) {
      this.logger.error('Error pushing metrics to local Prometheus:', error);
    }
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  // Method to record HTTP request metrics
  recordHttpRequest(
    method: string,
    route: string,
    status: number,
    duration: number,
  ) {
    this.httpRequestDuration.observe({ method, route, status }, duration);
    this.httpRequestsTotal.inc({ method, route, status });
  }
}
