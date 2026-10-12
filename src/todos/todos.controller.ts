import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { ContextLogger } from '../logger';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async getTodos() {
    const logger = new ContextLogger('TodosController');
    logger.log('GET /todos - Fetching all todos');
    const result = await this.todosService.getTodos();
    logger.log('GET /todos - Completed', { count: result?.todos?.length || 0 });
    return result;
  }

  @Get('user/:userId')
  async getTodosForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const logger = new ContextLogger('TodosController');
    logger.log(`GET /todos/user/${userId}`, { page, limit });
    return this.todosService.getTodosForUser(userId, Number(page), Number(limit));
  }

  @Post('complete')
  async completeMany(@Body('ids') ids: number[]) {
    const logger = new ContextLogger('TodosController');
    logger.log('POST /todos/complete', { count: ids.length });
    return this.todosService.completeMany(ids);
  }

  @Post()
  async addTodo(@Body('todo') todo: string, @Body('userId') userId: number) {
    const logger = new ContextLogger('TodosController');
    logger.log('POST /todos - Creating new todo', { userId });
    return this.todosService.addTodo(todo, userId);
  }

  @Patch(':id')
  async toggleTodoStatus(
    @Param('id') id: number,
    @Body('completed') completed: boolean,
  ) {
    const logger = new ContextLogger('TodosController');
    logger.log(`PATCH /todos/${id} - Toggling status`, { completed });
    return this.todosService.toggleTodoStatus(id, completed);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number) {
    const logger = new ContextLogger('TodosController');
    logger.log(`DELETE /todos/${id} - Deleting todo`);
    return this.todosService.deleteTodo(id);
  }
}
