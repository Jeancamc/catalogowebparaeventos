export interface Animacion {
  id?: number;
  nombre: string;             // Nombre del servicio de animación
  tipo: string;               // Show infantil, personajes, hora loca, etc.
  duracionHoras: number;      // Duración en horas
  precioPorEvento: number;    // Precio por evento
  publicoObjetivo: string;    // Infantil, juvenil, corporativo, etc.
  incluyePersonajes: boolean; // ¿Incluye personajes / animadores?
  nivelEnergia: string;       // Baja, Media, Alta
  descripcion: string;        // Descripción del servicio
  disponible: boolean;        // Disponible para contratar
}
