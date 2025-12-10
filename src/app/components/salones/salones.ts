import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SimpleTableComponent } from '../shared/data-table/data-table';
import { NotificationComponent, Notification } from '../shared/notification/notification';
import { ServSalonesJson } from '../../services/serv-salones-json';
import { Salon } from '../../models/salon';
import { Card } from "../shared/card/card";

@Component({
  selector: 'app-salones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleTableComponent,
    NotificationComponent,
    Card
],
  templateUrl: './salones.html',
  styleUrls: ['./salones.css'],
})
export class SalonesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private salonesService = inject(ServSalonesJson);;

  // Variables del componente
  salones: Salon[] = [];
  salonSeleccionado: any = null;
  modoEdicion: boolean = false;
  loading: boolean = false;
  notifications: Notification[] = [];

  // Configuración para la tabla
  tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre del Salón' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'precioHora', label: 'Precio por Hora' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'tipoEvento', label: 'Tipo de Evento' },
    { key: 'disponible', label: 'Disponible' },
  ];

  // Opciones para selects
  tiposEvento = ['Boda', 'Corporativo', 'Fiesta', 'Conferencia', 'Banquete'];
  ubicaciones = ['Centro', 'Norte', 'Sur', 'Este', 'Oeste'];

  // Formulario
  salonForm: FormGroup;
  Eliminar: any;

  constructor() {
    // Inicializar formulario
    this.salonForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      capacidad: ['', [Validators.required, Validators.min(10)]],
      precioHora: ['', [Validators.required, Validators.min(0)]],
      ubicacion: ['', Validators.required],
      tipoEvento: ['', Validators.required],
      serviciosIncluidos: [''],
      disponible: [true],
    });
  }

  ngOnInit(): void {
    this.cargarSalones();
  }

  // Cargar datos de ejemplo
  cargarSalones(): void {
    this.loading = true;

    this.salonesService.getAll().subscribe({
      next: (data) => {
        this.salones = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar salones:', error);
        this.mostrarMensaje('Error al cargar los salones', 'error');
        this.loading = false;
      }
    });
  }


  // CRUD Operations
  crearSalon(): void {
    if (this.salonForm.invalid) {
      this.salonForm.markAllAsTouched();
      return;
    }

    const formValue = this.salonForm.value;

    const nuevoSalon: Salon = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      capacidad: formValue.capacidad,
      precioHora: formValue.precioHora,
      ubicacion: formValue.ubicacion,
      tipoEvento: formValue.tipoEvento,
      serviciosIncluidos: formValue.serviciosIncluidos,
      disponible: formValue.disponible ? 'Sí' : 'No'
    };

    this.salonesService.create(nuevoSalon).subscribe({
      next: () => {
        this.mostrarMensaje('Salón creado exitosamente', 'success');
        this.salonForm.reset({ disponible: true });
        this.modoEdicion = false;
        this.salonSeleccionado = null;
        this.cargarSalones();
      },
      error: () => {
        this.mostrarMensaje('Error al crear el salón', 'error');
      }
    });
  }

actualizarSalon(): void {
    if (this.salonForm.invalid || !this.salonSeleccionado) {
      this.salonForm.markAllAsTouched();
      return;
    }

    const formValue = this.salonForm.value;

    const salonActualizado: Salon = {
      ...this.salonSeleccionado,
      ...formValue,
      disponible: formValue.disponible ? 'Sí' : 'No'
    };

    this.salonesService.update(salonActualizado).subscribe({
      next: () => {
        this.mostrarMensaje('Salón actualizado exitosamente', 'info');
        this.cancelarEdicion();
        this.cargarSalones();
      },
      error: () => {
        this.mostrarMensaje('Error al actualizar el salón', 'error');
      }
    });
  }
 
    eliminarSalon(salon: Salon): void {
    if (!salon.id) {
      this.mostrarMensaje('No se puede eliminar un salón sin id', 'error');
      return;
    }

    if (confirm(`¿Está seguro de eliminar el salón "${salon.nombre}"?`)) {
      this.salonesService.delete(salon.id).subscribe({
        next: () => {
          this.mostrarMensaje('Salón eliminado exitosamente', 'warning');
          this.cargarSalones();
        },
        error: () => {
          this.mostrarMensaje('Error al eliminar el salón', 'error');
        }
      });
    }
  }

  // Manejar acciones de la tabla
  onTableAction(event: { action: string; item: any }): void {
    const salon = event.item;

    switch (event.action) {
      case 'edit':
        this.seleccionarSalon(salon);
        break;
      case 'delete':
        this.eliminarSalon(salon);
        break;
    }
  }

  seleccionarSalon(salon: any): void {
    this.salonSeleccionado = salon;
    this.modoEdicion = true;

    // Convertir 'Sí'/'No' a boolean para el formulario
    const salonData = {
      ...salon,
      disponible: salon.disponible === 'Sí',
    };

    this.salonForm.patchValue(salonData);
  }

  cancelarEdicion(): void {
    this.salonSeleccionado = null;
    this.modoEdicion = false;
    this.salonForm.reset({ disponible: true });
  }

  private mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' | 'info' | 'warning' = 'success'
  ): void {
    const notification: Notification = {
      message: mensaje,
      type: tipo,
      duration: 3000,
    };

    this.notifications.push(notification);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 3000);
  }

  // Método para obtener estadísticas
  getEstadisticas() {
    return {
      total: this.salones.length,
      disponibles: this.salones.filter((s) => s.disponible === 'Sí').length,
      capacidadTotal: this.salones.reduce((sum, salon) => sum + salon.capacidad, 0),
    };
  }
}
