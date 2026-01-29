import { Animacion } from "./animacion";
import { Decoracion } from "./deco";
import { ServicioManteleria } from "./manteleriamodel";
import { Musica } from "./musica";
import { Salon } from "./salon";

// modelos/evento.ts
export interface Evento {
  id?: number;
  nombre: string;
  fechaEvento: Date | string;
  descripcion?: string;
  numeroInvitados: number;
  estado: string; // 'Pendiente', 'Confirmado', 'Cancelado', 'Completado'
  
  // IDs de servicios relacionados
  salonId?: number;
  animacionId?: number;
  decoracionId?: number;
  musicaId?: number;
  
  // Objetos completos (para cuando se cargan con includes)
  salon?: Salon;
  animacion?: Animacion;
  decoracion?: Decoracion;
  musica?: Musica;
  
  // Detalles de mantelería
  detallesManteleria?: DetalleEventoManteleria[];
  
  // Información del cliente
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string;
  
  // Totales y costos
  costoTotal?: number;
  anticipo?: number;
  saldoPendiente?: number;
  
  // Fechas del sistema
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface DetalleEventoManteleria {
  id?: number;
  eventoId: number;
  servicioManteleriaId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  
  // Objeto completo (opcional)
  servicioManteleria?: ServicioManteleria;
}

// Enums para estados
export const EstadosEvento = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  COMPLETADO: 'Completado'
} as const;

export type EstadoEvento = typeof EstadosEvento[keyof typeof EstadosEvento];