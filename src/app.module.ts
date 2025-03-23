import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsMiddleware } from './metrics/metrics.middleware';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [TodosModule, MetricsModule, IssuesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
