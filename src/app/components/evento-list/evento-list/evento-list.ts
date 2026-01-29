// componentes/evento-list/evento-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EventoService } from '../../../services/serv-eventos-json';
import { Evento, EstadosEvento } from '../../../models/evento';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.html'
})
export class EventoListComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  estados = Object.values(EstadosEvento);
  estadoFiltro = 'Todos';
  
  // Para detalles
  eventoSeleccionado?: Evento;
  mostrarDetalles = false;

  constructor(private eventoService: EventoService) { }

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventoService.getAll().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error cargando eventos:', error);
      }
    });
  }

  aplicarFiltro(): void {
    if (this.estadoFiltro === 'Todos') {
      this.eventosFiltrados = this.eventos;
    } else {
      this.eventosFiltrados = this.eventos.filter(e => e.estado === this.estadoFiltro);
    }
  }

  verDetalles(evento: Evento): void {
    this.eventoService.getById(evento.id!).subscribe({
      next: (eventoCompleto) => {
        this.eventoSeleccionado = eventoCompleto;
        this.mostrarDetalles = true;
      }
    });
  }

  calcularTotal(evento: Evento): number {
    let total = 0;
    
    if (evento.salon) total += evento.salon.precioHora * 4;
    if (evento.animacion) total += evento.animacion.precioPorEvento;
    if (evento.decoracion) total += evento.decoracion.precioPorEvento;
    if (evento.musica) total += evento.musica.precioPorHora * 4;
    
    if (evento.detallesManteleria) {
      total += evento.detallesManteleria.reduce((sum, detalle) => 
        sum + (detalle.precioUnitario * detalle.cantidad), 0);
    }
    
    return total;
  }

  confirmarEvento(id: number): void {
    if (confirm('¿Confirmar este evento?')) {
      this.eventoService.confirmarEvento(id).subscribe({
        next: () => {
          this.cargarEventos();
        }
      });
    }
  }

  cancelarEvento(id: number): void {
    const motivo = prompt('Motivo de cancelación:');
    if (motivo) {
      this.eventoService.cancelarEvento(id, motivo).subscribe({
        next: () => {
          this.cargarEventos();
        }
      });
    }
  }
}