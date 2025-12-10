import { Component } from '@angular/core';
import { Card } from '../shared/card/card';
import { CommonModule } from '@angular/common';
import { SimpleTableComponent } from "../shared/data-table/data-table";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Card, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
onTableAction($event: { action: string; item: any; }) {
throw new Error('Method not implemented.');
}
  productos = [
    { titulo: "Mantelería Premium", descripcion: "Diseños exclusivos para eventos elegantes.", imagen: "assets/descarga.jpg" },
    { titulo: "Decoración Floral", descripcion: "Arreglos únicos para bodas y recepciones.", imagen: "assets/floral.jpg" },
    { titulo: "Sillas Tiffany", descripcion: "Elegancia para todo tipo de eventos.", imagen: "assets/sillas.jpg" },
    { titulo: "Centros de Mesa", descripcion: "Decoración temática personalizada.", imagen: "assets/centros.jpg" },
    { titulo: "Iluminación LED", descripcion: "Ambienta tu evento con luces profesionales.", imagen: "assets/luces.jpg" },
    { titulo: "Carpa Elegante", descripcion: "Protección y estilo para exteriores.", imagen: "assets/carpa.jpg" },
    { titulo: "Mesa Imperial", descripcion: "Mesas amplias para eventos de lujo.", imagen: "assets/mesa.jpg" },
    { titulo: "Caminos de Mesa", descripcion: "Detalles decorativos para ambientar tu evento.", imagen: "assets/camino.jpg" }
  ];

  marcas = [
    { imagen:"assets/marca1.jpg", url:"https://www.facebook.com/tienda.de.arte.dc/"},
    { imagen:"assets/marca2.jpg",url:"https://www.facebook.com/p/Dekorfactory-100077738053069/"},
    { imagen:"assets/marca3.jpg", url:"https://www.facebook.com/decoracioneseventosmm/?locale=es_LA"},
    
  ];

}
