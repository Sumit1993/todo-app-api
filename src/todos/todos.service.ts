import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TodosService {
  constructor(private readonly httpService: HttpService) {}

  async getTodos() {
    // 30% chance to simulate high latency (5s delay)
    const delay = Math.random() < 0.3 ? 5000 : 100;
    await new Promise((resolve) => setTimeout(resolve, delay));

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
