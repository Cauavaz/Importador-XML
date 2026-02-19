import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
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
