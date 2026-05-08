export interface AutoRead{
    id_Auto: string;
    fecha_creacion: string;
    fecha_edicion: string | null;
    id_usuario_crea: string;
    id_usuario_edita: string | null;
    id_Sucursal: string
    id_Compra: string;

}

export interface AutoCreate{
    id_usuario_crea: string;
    id_Sucursal: string;
    id_Compra: string;
}

export interface AutoUpdate{
    Marca?: string | null;
    Modelo?: string | null;
    Tipo_Auto?: string | null;
    Precio?: number | null;
    Estado?: boolean | null;
    id_usuario_edita?: string | null;
}

export interface ClienteRead {
  id_Cliente: string; // UUID
}

export interface ClienteUpdate {
  nombre?: string | null;
  Apellido?: string | null;
  email?: string | null;
  telefono?: string | null;
  Direccion?: string | null;
  Tipo_Cliente?: string | null;
}

export interface CompraRead{
  id_Compra: string;  
  Fecha?: string | null; 
  fecha_creacion: string;  
  fecha_edicion?: string | null;
  id_usuario_crea: string; 
  id_usuario_edita?: string | null;
  id_Empleado: string;
}

export interface CompraCreate {
  id_usuario_crea: string; 
  id_Empleado: string; 
}

export interface CompraUpdate {
  Precio?: number | null;
  id_usuario_edita?: string | null; 
}

export interface DetalleVentaRead {
  id_Detalle_Venta: string; 
  fecha_creacion: string;  
  fecha_edicion?: string | null;
  id_usuario_crea: string; 
  id_usuario_edita?: string | null;
  id_Venta: string; 
  id_Auto: string; 
}

export interface DetalleVentaCreate {
  id_usuario_crea: string; 
  id_Venta: string; 
  id_Auto: string; 
}

export interface DetalleVentaUpdate {
  id_usuario_edita?: string | null; 
}

export interface EmpleadoRead{
  id_Empleado: string; 
}


export interface EmpleadoUpdate {
  Nombre?: string | null;
  Cargo?: string | null;
  Telefono?: string | null;
  Salario?: number | null;
}

export interface MantenimientoRead {
  id_Mantenimiento: string;
  Fecha?: string | null; 
  fecha_creacion: string; 
  fecha_edicion?: string | null;
  id_usuario_crea: string; 
  id_usuario_edita?: string | null;
  id_Auto: string; 
  id_Empleado: string; 
}

export interface MantenimientoCreate{
  id_usuario_crea: string; 
  id_Auto: string; 
  id_Empleado: string; 
}

export interface MantenimientoUpdate {
  Tipo_Servicio?: string | null;
  Costo?: number | null;
  id_usuario_edita?: string | null; // UUID
}

export interface SucursalRead {
  id_Sucursal: string;
}

export interface SucursalUpdate {
  Nombre?: string | null;
  Telefono?: string | null;
  Direccion?: string | null;
}

export interface UsuarioRead {
  id_Usuario: string; 
  fecha_creacion: string;
  fecha_edicion?: string | null;
}

export interface UsuarioUpdate {
  nombre?: string | null;
  nombre_usuario?: string | null;
  email?: string | null;
  contraseña_hash?: string | null;
  telefono?: string | null;
  activo?: boolean | null;
}

export interface UsuarioCreate {
  contraseña_hash: string;
}

export interface VentaRead {
  id_Venta: string; 
  Fecha: string; 
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_crea: string; 
  id_usuario_edita?: string | null;
  id_Cliente: string; 
  id_Empleado: string; 
}

export interface VentaCreate{
  Fecha: string; 
  id_usuario_crea: string; 
  id_Cliente: string; 
  id_Empleado: string; 
}

export interface VentaUpdate {
  Precio_Venta?: number | null;
  Metodo_Pago?: string | null;
  id_usuario_edita?: string | null; 
}
