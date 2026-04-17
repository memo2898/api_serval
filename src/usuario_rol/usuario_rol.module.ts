import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRolService } from './usuario_rol.service';
import { UsuarioRolController } from './usuario_rol.controller';
import { UsuarioRol } from './entities/usuario_rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioRol])],
  controllers: [UsuarioRolController],
  providers: [UsuarioRolService],

})
export class UsuarioRolModule {}
