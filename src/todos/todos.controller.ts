import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  private readonly logger = new Logger(TodosController.name);

  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    this.logger.log('Fetching all todos');
    return this.todosService.getTodos();
  }

  @Post()
  async addTodo(@Body('todo') todo: string, @Body('userId') userId: number) {
    this.logger.log(`Creating todo for user ${userId}`);
    return this.todosService.addTodo(todo, userId);
  }

  @Patch(':id')
  async toggleTodoStatus(
    @Param('id') id: number,
    @Body('completed') completed: boolean,
  ) {
    this.logger.log(`Toggling todo ${id} status`);
    return this.todosService.toggleTodoStatus(id, completed);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number) {
    this.logger.log(`Deleting todo ${id}`);
    return this.todosService.deleteTodo(id);
  }
}
