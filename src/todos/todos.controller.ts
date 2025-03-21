import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    // 20% chance to simulate a server error
    if (Math.random() < 0.2) {
      throw new InternalServerErrorException('Random Server Error');
    }
    return this.todosService.getTodos();
  }
}
