import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimpleTableComponent } from '../shared/data-table/data-table';
import { NotificationComponent, Notification } from '../shared/notification/notification';
import { Card } from '../shared/card/card';
import { ServMusicaJson } from '../../services/serv-musica-json';
import { Musica } from '../../models/musica';

@Component({
  selector: 'app-musica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleTableComponent, NotificationComponent, Card],
  templateUrl: './musica.html',
  styleUrls: ['./musica.css']
})
export class MusicaComponent implements OnInit {
  private musicaService = inject(ServMusicaJson);
  private fb = inject(FormBuilder);

  // Variables del componente
  serviciosMusica: Musica[] = [];
  serviciosFiltrados: Musica[] = [];
  servicioSeleccionado: Musica | null = null;
  formVisible: boolean = false;
  loading: boolean = false;
  notifications: Notification[] = [];

  // Configuración para la tabla reutilizable
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'precioPorHora', label: 'Precio/Hora' },
    { key: 'generoMusical', label: 'Género' },
    { key: 'disponible', label: 'Disponible' }
  ];

  // Opciones para selects
  tiposMusica = ['DJ', 'Banda en vivo', 'Mariachi', 'Karaoke', 'Solista', 'Orquesta'];

  // Formulario
  formMusica: FormGroup;

  constructor() {
    this.formMusica = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', Validators.required],
      precioPorHora: ['', [Validators.required, Validators.min(1)]],
      generoMusical: ['', Validators.required],
      equipoIncluido: ['', Validators.required],
      disponible: [true]
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.loading = true;
    this.musicaService.getAll().subscribe({
      next: (datos: Musica[]) => {
        this.serviciosMusica = datos;
        this.serviciosFiltrados = datos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.mostrarNotificacion('Error al cargar los servicios', 'success');
        this.loading = false;
      }
    });
  }

  // Mostrar formulario para nuevo servicio
  showForm(): void {
    this.formVisible = true;
    this.servicioSeleccionado = null;
    this.formMusica.reset({ disponible: true });
  }

  // Ocultar formulario
  hideForm(): void {
    this.formVisible = false;
    this.servicioSeleccionado = null;
    this.formMusica.reset();
  }

  // Guardar (crear o actualizar)
  save(): void {
    if (this.formMusica.invalid) {
      this.formMusica.markAllAsTouched();
      return;
    }

    const datos = this.formMusica.value;

    if (this.servicioSeleccionado?.id) {
      // Actualizar
      const musicaActualizada: Musica = { ...datos, id: this.servicioSeleccionado.id };
      this.musicaService.update(musicaActualizada).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio actualizado exitosamente', 'success');
          this.hideForm();
          this.cargarServicios();
        },
        error: () => {
          this.mostrarNotificacion('Error al actualizar', 'success');
        }
      });
    } else {
      // Crear
      const nuevaMusica: Musica = { ...datos };
      this.musicaService.create(nuevaMusica).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio creado exitosamente', 'success');
          this.hideForm();
          this.cargarServicios();
        },
        error: () => {
          this.mostrarNotificacion('Error al crear', 'success');
        }
      });
    }
  }

  // Editar servicio
  editDecoracion(musica: Musica): void {
    this.servicioSeleccionado = musica;
    this.formVisible = true;
    this.formMusica.patchValue(musica);
  }

  // Eliminar servicio
  delete(musica: Musica): void {
    if (confirm(`¿Está seguro de eliminar "${musica.nombre}"?`)) {
      this.musicaService.delete(musica.id!).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio eliminado exitosamente', 'success');
          this.cargarServicios();
        },
        error: () => {
          this.mostrarNotificacion('Error al eliminar', 'success');
        }
      });
    }
  }

  // Búsqueda
  search(value: string): void {
    if (!value.trim()) {
      this.serviciosFiltrados = this.serviciosMusica;
      return;
    }
    
    this.serviciosFiltrados = this.serviciosMusica.filter(servicio =>
      servicio.nombre.toLowerCase().includes(value.toLowerCase()) ||
      servicio.tipo.toLowerCase().includes(value.toLowerCase())
    );
  }

  servicioSeleccionadoParaVer: Musica | null = null;
  modalVerVisible = false; 
  // Manejar acciones de la tabla
  onTableAction(event: { action: string; item: any }): void {
    const musica = event.item;

    switch (event.action) {
      case 'view':
        this.servicioSeleccionadoParaVer = musica;
        this.modalVerVisible = true;
        break;
      case 'edit':
        this.editDecoracion(musica);
        break;
      case 'delete':
        this.delete(musica);
        break;
    }
  }

  // Mostrar notificaciones
  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning' = 'success'): void {
    const notification: Notification = {
      message: mensaje,
      type: tipo,
      duration: 3000
    };

    this.notifications.push(notification);

    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 3000);
  }

  
}