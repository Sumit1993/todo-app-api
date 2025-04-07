import {
  Controller,
  Get,
  Post,
  Query,
  Logger,
  HttpStatus,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  private readonly logger = new Logger(IssuesController.name);
  private readonly validIssueTypes = [
    'slow',
    'error',
    'not-found',
    'unauthorized',
    'forbidden',
    'bad-request',
  ];

  constructor(private readonly issuesService: IssuesService) {}

  @Get('simulate')
  async simulateIssue(@Query('type') type: string) {
    // Validate input to prevent misuse
    if (!type || !this.validIssueTypes.includes(type)) {
      this.logger.warn(`Invalid issue type requested: ${type}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Invalid issue type. Valid types are: ${this.validIssueTypes.join(', ')}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(`Simulating issue: ${type}`);

    switch (type) {
      case 'slow':
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return {
          status: 'success',
          message: 'Simulated slow response (5 seconds delay)',
        };

      case 'error':
        this.logger.error('Simulated server error occurred');
        throw new HttpException(
          {
            status: 'error',
            message: 'This is a simulated server error response',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      case 'not-found':
        this.logger.warn('Simulated not found error');
        throw new HttpException(
          {
            status: 'error',
            message: 'This is a simulated not found error',
          },
          HttpStatus.NOT_FOUND,
        );

      case 'unauthorized':
        this.logger.warn('Simulated unauthorized error');
        throw new HttpException(
          {
            status: 'error',
            message: 'This is a simulated unauthorized error',
          },
          HttpStatus.UNAUTHORIZED,
        );

      case 'forbidden':
        this.logger.warn('Simulated forbidden error');
        throw new HttpException(
          {
            status: 'error',
            message: 'This is a simulated forbidden error',
          },
          HttpStatus.FORBIDDEN,
        );

      case 'bad-request':
        this.logger.warn('Simulated bad request error');
        throw new HttpException(
          {
            status: 'error',
            message: 'This is a simulated bad request error',
          },
          HttpStatus.BAD_REQUEST,
        );

      default:
        return {
          status: 'warning',
          message: `Unknown issue type: ${type}`,
        };
    }
  }

  @Post('service-down')
  @HttpCode(HttpStatus.OK)
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
