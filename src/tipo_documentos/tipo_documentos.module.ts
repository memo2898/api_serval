import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocumentosService } from './tipo_documentos.service';
import { TipoDocumentosController } from './tipo_documentos.controller';
import { TipoDocumento } from './entities/tipo_documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoDocumento])],
  controllers: [TipoDocumentosController],
  providers: [TipoDocumentosService],

})
export class TipoDocumentosModule {}
