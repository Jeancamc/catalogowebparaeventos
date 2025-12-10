import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SimpleTableComponent } from '../shared/data-table/data-table';
import { NotificationComponent, Notification } from '../shared/notification/notification';
import { Card } from '../shared/card/card';
import { ServAnimacionJson } from '../../services/serv-animacion-json';
import { Animacion } from '../../models/animacion';

@Component({
  selector: 'app-animacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleTableComponent,
    NotificationComponent,
    Card
  ],
  templateUrl: './animacion.html',
  styleUrls: ['./animacion.css']
})
export class AnimacionComponent implements OnInit {

  // Servicios y utilidades
  private animacionService = inject(ServAnimacionJson);
  private fb = inject(FormBuilder);

  // Datos
  serviciosAnimacion: Animacion[] = [];
  serviciosFiltrados: Animacion[] = [];
  servicioSeleccionado: Animacion | null = null;

  // UI
  formVisible: boolean = false;
  loading: boolean = false;
  notifications: Notification[] = [];

  // Columnas para la tabla
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'duracionHoras', label: 'Duración (h)' },
    { key: 'precioPorEvento', label: 'Precio/Evento' },
    { key: 'publicoObjetivo', label: 'Público' },
    { key: 'disponible', label: 'Disponible' }
  ];

  // Selects
  tiposAnimacion = [
    'Show infantil',
    'Personajes temáticos',
    'Hora loca',
    'Animación corporativa',
    'Presentador/MC'
  ];

  nivelesEnergia = ['Baja', 'Media', 'Alta'];

  publicosObjetivo = ['Infantil', 'Juvenil', 'Adulto', 'Familiar', 'Corporativo'];

  // Formulario
  formAnimacion: FormGroup;

  constructor() {
    this.formAnimacion = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', Validators.required],
      duracionHoras: [1, [Validators.required, Validators.min(1)]],
      precioPorEvento: [0, [Validators.required, Validators.min(1)]],
      publicoObjetivo: ['', Validators.required],
      incluyePersonajes: [false],
      nivelEnergia: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      disponible: [true]
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  // Cargar registros
  cargarServicios(): void {
    this.loading = true;
    this.animacionService.getAll().subscribe({
      next: (datos: Animacion[]) => {
        this.serviciosAnimacion = datos;
        this.serviciosFiltrados = datos;
        this.loading = false;
      },
      error: () => {
        this.mostrarNotificacion('Error al cargar las animaciones', 'error');
        this.loading = false;
      }
    });
  }

  // Mostrar formulario
  showForm(): void {
    this.formVisible = true;
    this.servicioSeleccionado = null;
    this.formAnimacion.reset({
      duracionHoras: 1,
      precioPorEvento: 0,
      incluyePersonajes: false,
      disponible: true
    });
  }

  // Ocultar formulario
  hideForm(): void {
    this.formVisible = false;
    this.servicioSeleccionado = null;
    this.formAnimacion.reset();
  }

  // Guardar o actualizar
  save(): void {
    if (this.formAnimacion.invalid) {
      this.formAnimacion.markAllAsTouched();
      return;
    }

    const datos = this.formAnimacion.value;

    // ACTUALIZAR
    if (this.servicioSeleccionado?.id) {
      const animacionActualizada: Animacion = {
        ...datos,
        id: this.servicioSeleccionado.id
      };

      this.animacionService.update(animacionActualizada).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio de animación actualizado', 'success');
          this.hideForm();
          this.cargarServicios();
        },
        error: () => {
          this.mostrarNotificacion('Error al actualizar el servicio', 'error');
        }
      });

      return;
    }

    // CREAR
    const nuevaAnimacion: Animacion = { ...datos };

    this.animacionService.create(nuevaAnimacion).subscribe({
      next: () => {
        this.mostrarNotificacion('Servicio de animación creado', 'success');
        this.hideForm();
        this.cargarServicios();
      },
      error: () => {
        this.mostrarNotificacion('Error al crear el servicio', 'error');
      }
    });
  }

  // Editar
  edit(animacion: Animacion): void {
    this.servicioSeleccionado = animacion;
    this.formVisible = true;
    this.formAnimacion.patchValue(animacion);
  }

  // Eliminar
  delete(animacion: Animacion): void {
    if (!animacion.id) {
      this.mostrarNotificacion('No se puede eliminar un servicio sin ID', 'error');
      return;
    }

    if (confirm(`¿Desea eliminar "${animacion.nombre}"?`)) {
      this.animacionService.delete(animacion.id).subscribe({
        next: () => {
          this.mostrarNotificacion('Servicio eliminado', 'warning');
          this.cargarServicios();
        },
        error: () => {
          this.mostrarNotificacion('Error al eliminar el servicio', 'error');
        }
      });
    }
  }

  // Buscar
  search(value: string): void {
    if (!value.trim()) {
      this.serviciosFiltrados = this.serviciosAnimacion;
      return;
    }

    const term = value.toLowerCase();

    this.serviciosFiltrados = this.serviciosAnimacion.filter(servicio =>
      servicio.nombre.toLowerCase().includes(term) ||
      servicio.tipo.toLowerCase().includes(term) ||
      servicio.publicoObjetivo.toLowerCase().includes(term)
    );
  }

  // Modal ver
  servicioSeleccionadoParaVer: Animacion | null = null;
  modalVerVisible = false;

  onTableAction(event: { action: string; item: any }): void {
    const animacion = event.item as Animacion;

    switch (event.action) {
      case 'view':
        this.servicioSeleccionadoParaVer = animacion;
        this.modalVerVisible = true;
        break;

      case 'edit':
        this.edit(animacion);
        break;

      case 'delete':
        this.delete(animacion);
        break;
    }
  }

  cerrarModalVer(): void {
    this.modalVerVisible = false;
    this.servicioSeleccionadoParaVer = null;
  }

  // Notificaciones
  private mostrarNotificacion(
    mensaje: string,
    tipo: 'success' | 'error' | 'info' | 'warning' = 'success'
  ): void {

    const notification: Notification = {
      message: mensaje,
      type: tipo,
      duration: 3000
    };

    this.notifications.push(notification);

    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index > -1) this.notifications.splice(index, 1);
    }, 3000);
  }
}
