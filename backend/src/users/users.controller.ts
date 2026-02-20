import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'usuario123' },
        password: { type: 'string', example: 'senha123' },
        role: { type: 'string', example: 'user' }
      },
      required: ['username', 'password']
    }
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        userId: { type: 'number' }
      }
    }
  })
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role?: string,
  ) {
    const user = await this.usersService.create(username, password, role);
    return {
      message: 'Usuário criado com sucesso',
      userId: user.id,
    };
  }
}
