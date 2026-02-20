import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'usuario123' },
        password: { type: 'string', example: 'senha123' }
      },
      required: ['username', 'password']
    }
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  })
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuário' })
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
    description: 'Usuário registrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  })
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') role?: string,
  ) {
    return this.authService.register(username, password, role);
  }
}
