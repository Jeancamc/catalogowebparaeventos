// modelos/evento-form.ts
export interface EventoForm {
  // Información básica
  nombre: string;
  fechaEvento: string; // Formato ISO
  descripcion?: string;
  numeroInvitados: number;
  estado: string;
  
  // Servicios seleccionados
  salonId?: number | null;
  animacionId?: number | null;
  decoracionId?: number | null;
  musicaId?: number | null;
  
  // Mantelería seleccionada
  detallesManteleria: DetalleManteleriaForm[];
  
  // Información del cliente
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  
  // Pagos
  anticipo?: number;
}

export interface DetalleManteleriaForm {
  servicioManteleriaId: number;
  cantidad: number;
  // precioUnitario se obtiene del servicio
}