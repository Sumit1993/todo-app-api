import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [TodosModule, MetricsModule],
})
export class AppModule {}
