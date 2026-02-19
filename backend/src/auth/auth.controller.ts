import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role?: string,
  ) {
    return this.authService.register(username, password, role);
  }
}
