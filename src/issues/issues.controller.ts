import { Controller, Get, Post, Query, Logger } from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  private readonly logger = new Logger(IssuesController.name);

  constructor(private readonly issuesService: IssuesService) {}

  @Get('simulate')
  async simulateIssue(@Query('type') type: string) {
    this.logger.log(`Simulating issue: ${type}`);

    switch (type) {
      case 'slow':
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return {
          status: 'success',
          message: 'Simulated slow response (5 seconds delay)',
        };

      case 'error':
        this.logger.error('Simulated error occurred');
        return {
          status: 'error',
          message: 'This is a simulated error response',
        };

      default:
        return {
          status: 'warning',
          message: `Unknown issue type: ${type}`,
        };
    }
  }

  @Post('service-down')
  simulateServiceDown() {
    this.logger.warn('Simulating service unavailability');

    // Just return a success message - we won't actually take down the service in the cloud version
    return {
      status: 'success',
      message:
        'Service down simulation triggered (simulated only, service remains available)',
    };
  }
}
