import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(private readonly httpService: HttpService) {}

  async getTodos() {
    this.logger.log('Fetching todos from external API');
    const response = await this.httpService.axiosRef.get(
      'https://dummyjson.com/todos',
    );
    return response.data;
  }

  async addTodo(todo: string, userId: number) {
    const response = await this.httpService.axiosRef.post(
      'https://dummyjson.com/todos/add',
      { todo, completed: false, userId },
    );
    return response.data;
  }

  async toggleTodoStatus(id: number, completed: boolean) {
    const response = await this.httpService.axiosRef.put(
      `https://dummyjson.com/todos/${id}`,
      { completed: !completed },
    );
    return response.data;
  }

  async deleteTodo(id: number) {
    const response = await this.httpService.axiosRef.delete(
      `https://dummyjson.com/todos/${id}`,
    );
    return response.data;
  }
}
