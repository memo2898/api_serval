/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pin: string) {
    const normalizedUsername = username.toLowerCase().trim();

    const user = await this.usersService.findByUsername(normalizedUsername);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar si el usuario está bloqueado
    const isBlocked = await this.usersService.isUserBlocked(user.id);
    if (isBlocked) {
      throw new HttpException(
        'Account temporarily locked due to multiple failed login attempts. Please try again later.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Verificar si el usuario está activo
    if (user.estado.toLowerCase() !== 'activo') {
      throw new UnauthorizedException('User account is not active');
    }

    // Verificar el PIN (comparación directa)
    if (pin.trim() !== user.pin) {
      await this.usersService.registerFailedAttempt(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastAccess(user.id);

    const userData = await this.usersService.findOne(user.id);

    const payload = {
      username: user.username,
      sub: user.id,
      roles: userData.roles.map((r) => r.nombre),
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: userData,
    };
  }
}
