export interface Salon {
  id?: number;
  nombre: string;
  descripcion?: string;
  capacidad: number;
  precioHora: number;
  ubicacion: string;
  tipoEvento: string;
  serviciosIncluidos?: string;
  disponible: boolean; // 'Sí' o 'No'
}
