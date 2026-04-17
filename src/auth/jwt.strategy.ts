/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsuariosService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'put the pass',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload recibido:', payload); // Para debug

    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        console.log('Usuario no encontrado para ID:', payload.sub);
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return user; // Retorna el usuario si es encontrado
    } catch (error) {
      console.error('Error en validación JWT:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
