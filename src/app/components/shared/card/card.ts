import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
})
export class Card {
  @Input() titulo?: string = '';
  @Input() descripcion?: string = '';
  @Input() imagen: string = ''; 
  @Input() url?: string;
  @Input() mostrarBotones: boolean = true; // Nuevo input para mostrar u ocultar botones

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default.jpg';
  }

  onClick() {
    if (this.url) {
      window.open(this.url, '_blank');
    }
  }
}
