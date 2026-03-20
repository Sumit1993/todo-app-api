import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ContextLogger } from '../logger';
import { RequestCache } from '../cache/request-cache';

const SERVICE_TIMEOUT_MS = 3000;

@Injectable()
export class TodosService implements OnModuleDestroy {
  // Note: Each service instance gets its own logger for encapsulation
  private readonly logger = new ContextLogger('TodosService');
  private readonly cache = new RequestCache(30000);

  constructor(private readonly httpService: HttpService) {}

  private withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Service timeout exceeded')),
          SERVICE_TIMEOUT_MS,
        ),
      ),
    ]);
  }

  async getTodos() {
    const cached = this.cache.get('todos');
    if (cached) {
      this.logger.log('Returning cached todos');
      return cached;
    }

    this.logger.log('Fetching todos from external API');
    const startTime = Date.now();

    try {
      const response = await this.withTimeout(
        this.httpService.axiosRef.get('https://dummyjson.com/todos'),
      );

      this.logger.logPerformance('getTodos', Date.now() - startTime, {
        count: response.data?.todos?.length || 0,
      });

      this.cache.set('todos', response.data);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch todos', error as Error);
      throw error;
    }
  }

  async addTodo(todo: string, userId: number) {
    this.logger.log('Adding new todo', { todo, userId });

    const response = await this.withTimeout(
      this.httpService.axiosRef.post('https://dummyjson.com/todos/add', {
        todo,
        completed: false,
        userId,
      }),
    );

    this.cache.invalidate('todos');
    return response.data;
  }

  async toggleTodoStatus(id: number, completed: boolean) {
    this.logger.log('Toggling todo status', { id, completed });

    const response = await this.withTimeout(
      this.httpService.axiosRef.put(`https://dummyjson.com/todos/${id}`, {
        completed,
      }),
    );

    this.cache.invalidate('todos');
    return response.data;
  }

  async deleteTodo(id: number) {
    this.logger.log('Deleting todo', { id });

    const response = await this.withTimeout(
      this.httpService.axiosRef.delete(`https://dummyjson.com/todos/${id}`),
    );

    this.cache.invalidate('todos');
    return response.data;
  }

  onModuleDestroy() {
    this.cache.destroy();
  }
}
