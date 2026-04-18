import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDocumentosModule } from './tipo_documentos/tipo_documentos.module';
import { EmpresasModule } from './empresas/empresas.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { TerminalesModule } from './terminales/terminales.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { RolPermisoModule } from './rol_permiso/rol_permiso.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PaisesModule } from './paises/paises.module';
import { ImpuestosModule } from './impuestos/impuestos.module';
import { FamiliasModule } from './familias/familias.module';
import { SubfamiliasModule } from './subfamilias/subfamilias.module';
import { ArticulosModule } from './articulos/articulos.module';
import { ArticuloImpuestosModule } from './articulo_impuestos/articulo_impuestos.module';
import { TarifasModule } from './tarifas/tarifas.module';
import { PreciosPorTarifaModule } from './precios_por_tarifa/precios_por_tarifa.module';
import { AlergenosModule } from './alergenos/alergenos.module';
import { ArticuloAlergenosModule } from './articulo_alergenos/articulo_alergenos.module';
import { GruposModificadoresModule } from './grupos_modificadores/grupos_modificadores.module';
import { ModificadoresModule } from './modificadores/modificadores.module';
import { ArticuloGruposModificadoresModule } from './articulo_grupos_modificadores/articulo_grupos_modificadores.module';
import { CombosModule } from './combos/combos.module';
import { ComboArticulosModule } from './combo_articulos/combo_articulos.module';
import { ZonasModule } from './zonas/zonas.module';
import { MesasModule } from './mesas/mesas.module';
import { ClientesModule } from './clientes/clientes.module';
import { FormasPagoModule } from './formas_pago/formas_pago.module';
import { DescuentosModule } from './descuentos/descuentos.module';
import { TurnosCajaModule } from './turnos_caja/turnos_caja.module';
import { MovimientosCajaModule } from './movimientos_caja/movimientos_caja.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { OrdenLineasModule } from './orden_lineas/orden_lineas.module';
import { OrdenLineaModificadoresModule } from './orden_linea_modificadores/orden_linea_modificadores.module';
import { OrdenPagosModule } from './orden_pagos/orden_pagos.module';
import { FacturasModule } from './facturas/facturas.module';
import { DestinosImpresionModule } from './destinos_impresion/destinos_impresion.module';
import { KdsOrdenesModule } from './kds_ordenes/kds_ordenes.module';
import { StockModule } from './stock/stock.module';
import { MovimientosStockModule } from './movimientos_stock/movimientos_stock.module';
import { ConfiguracionSucursalModule } from './configuracion_sucursal/configuracion_sucursal.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { UtilsModule } from './utils/utils.module';
import { SocketsModule } from './sockets/sockets.module';
import { MonedasModule } from './monedas/monedas.module';
import { ReservacionesModule } from './reservaciones/reservaciones.module';
import { UsuarioRolModule } from './usuario_rol/usuario_rol.module';
import { SucursalImpuestosModule } from './sucursal_impuestos/sucursal_impuestos.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TipoDocumentosModule,
    EmpresasModule,
    SucursalesModule,
    TerminalesModule,
    RolesModule,
    PermisosModule,
    RolPermisoModule,
    UsuariosModule,
    PaisesModule,
    ImpuestosModule,
    FamiliasModule,
    SubfamiliasModule,
    ArticulosModule,
    ArticuloImpuestosModule,
    TarifasModule,
    PreciosPorTarifaModule,
    AlergenosModule,
    ArticuloAlergenosModule,
    GruposModificadoresModule,
    ModificadoresModule,
    ArticuloGruposModificadoresModule,
    CombosModule,
    ComboArticulosModule,
    ZonasModule,
    MesasModule,
    ClientesModule,
    FormasPagoModule,
    DescuentosModule,
    TurnosCajaModule,
    MovimientosCajaModule,
    OrdenesModule,
    OrdenLineasModule,
    OrdenLineaModificadoresModule,
    OrdenPagosModule,
    FacturasModule,
    DestinosImpresionModule,
    KdsOrdenesModule,
    StockModule,
    MovimientosStockModule,
    ConfiguracionSucursalModule,
    AuthModule,
    UploadsModule,
    MailModule,
    UtilsModule,
    SocketsModule,
    MonedasModule,
    ReservacionesModule,
    UsuarioRolModule,
    SucursalImpuestosModule,
    ReportesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
