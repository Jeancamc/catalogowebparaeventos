export interface ServicioManteleria {
  id: number;
  nombre: string;                    // Text input
  descripcion: string;               // Textarea
  tipo: string;                      // SELECT
  material: string;                  // SELECT
  color: string;                     // Text input
  medidas: string;                   // Text input
  precioAlquiler: number;            // Number input
  precioVenta?: number;              // Number input (opcional)
  stockDisponible: number;           // Number input
  disponible: boolean;               // CHECKBOX - ¡TIPO DIFERENTE!
  categoria: string;                 // RADIO - ¡TIPO DIFERENTE!
  imagenUrl?: string;                // Text input (URL)
  fechaRegistro: Date;               // DATE PICKER - ¡TIPO DIFERENTE!
}

// Opciones para selects y radios
export const TIPOS_MANTEL = [
  'Rectangular', 'Redondo', 'Cuadrado', 'Ovalado', 'Corrido'
];

export const MATERIALES = [
  'Algodón', 'Poliéster', 'Lino', 'Seda', 'Tul', 'Organza'
];

export const CATEGORIAS = [
  'Boda', 'Corporativo', 'Social', 'Infantil', 'Gala'
];