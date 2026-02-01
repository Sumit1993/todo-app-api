import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ContextLogger } from '../logger';

@Injectable()
export class TodosService {
  // Note: Each service instance gets its own logger for encapsulation
  private readonly logger = new ContextLogger('TodosService');

  constructor(private readonly httpService: HttpService) {}

  async getTodos() {
    this.logger.log('Fetching todos from external API');
    const startTime = Date.now();

    try {
      const response = await this.httpService.axiosRef.get(
        'https://dummyjson.com/todos',
      );

      this.logger.logPerformance('getTodos', Date.now() - startTime, {
        count: response.data?.todos?.length || 0,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch todos', error as Error);
      throw error;
    }
  }

  async addTodo(todo: string, userId: number) {
    this.logger.log('Adding new todo', { todo, userId });

    const response = await this.httpService.axiosRef.post(
      'https://dummyjson.com/todos/add',
      { todo, completed: false, userId },
    );
    return response.data;
  }

  async toggleTodoStatus(id: number, completed: boolean) {
    this.logger.log('Toggling todo status', { id, completed });

    const response = await this.httpService.axiosRef.put(
      `https://dummyjson.com/todos/${id}`,
      { completed },
    );
    return response.data;
  }

  async deleteTodo(id: number) {
    this.logger.log('Deleting todo', { id });

    const response = await this.httpService.axiosRef.delete(
      `https://dummyjson.com/todos/${id}`,
    );
    return response.data;
  }
}
