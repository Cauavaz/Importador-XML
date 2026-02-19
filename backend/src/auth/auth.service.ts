import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, salt: __, ...result } = user;
    return result;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    };

    const token = this.jwtService.sign(payload);

    // Atualizar data de criação do token sem bloquear o login em caso de lock no SQLite
    try {
      await this.usersService.updateTokenCreatedAt(user.id);
    } catch (error) {
      console.warn('Falha ao atualizar TokenDataCriacao, seguindo login:', (error as Error).message);
    }

    return {
      token,
      name: user.username,
      role: user.role,
    };
  }

  async register(username: string, password: string, role?: string) {
    const existingUser = await this.usersService.findByUsername(username);

    if (existingUser) {
      throw new UnauthorizedException('Usuário já existe');
    }

    const user = await this.usersService.create(username, password, role);

    return {
      message: 'Usuário criado com sucesso',
      userId: user.id,
    };
  }
}
