import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  private readonly logger = new Logger(TodosController.name);

  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    // 20% chance to simulate a server error
    if (Math.random() < 0.2) {
      this.logger.error('Simulated Random Server Error');
      throw new InternalServerErrorException('Random Server Error');
    }
    return this.todosService.getTodos();
  }

  @Post()
  async addTodo(@Body('todo') todo: string, @Body('userId') userId: number) {
    // Simulate a random delay
    if (Math.random() < 0.3) {
      const delay = Math.floor(Math.random() * 5000) + 1000; // 1 to 5 seconds delay
      this.logger.warn(`Simulated delay of ${delay}ms in addTodo`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return this.todosService.addTodo(todo, userId);
  }

  @Patch(':id')
  async toggleTodoStatus(
    @Param('id') id: number,
    @Body('completed') completed: boolean,
  ) {
    // Simulate a random error
    if (Math.random() < 0.1) {
      this.logger.error('Simulated Error in toggleTodoStatus');
      throw new InternalServerErrorException(
        'Simulated Error in toggleTodoStatus',
      );
    }
    return this.todosService.toggleTodoStatus(id, completed);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number) {
    // Simulate a random timeout
    if (Math.random() < 0.2) {
      const timeout = Math.floor(Math.random() * 3000) + 1000; // 1 to 3 seconds timeout
      this.logger.warn(`Simulated timeout of ${timeout}ms in deleteTodo`);
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
    return this.todosService.deleteTodo(id);
  }
}
