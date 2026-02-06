import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Componentes reutilizables
import { SimpleTableComponent } from '../../shared/data-table/data-table';
import { NotificationComponent, Notification } from '../../shared/notification/notification';

// Modelos y servicios
import { Manteles, TIPOS_MANTEL, MATERIALES, CATEGORIAS } from '../../../models/manteleriamodel';
import { Card } from '../../shared/card/card';
import { ServManteleria } from '../../../services/serv-manteleria-api';

@Component({
  selector: 'app-manteleria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SimpleTableComponent,
    NotificationComponent,
    Card,
  ],
  templateUrl: './manteles.html',
  styleUrls: ['./manteles.css'],
})
export class ManteleriaComponent implements OnInit, OnDestroy {
  private manteleriaService = inject(ServManteleria);
  private fb = inject(FormBuilder);
  private subscription: Subscription = new Subscription();

  // Variables del componente
  servicios: Manteles[] = [];
  servicioSeleccionado: Manteles | null = null;
  modoEdicion: boolean = false;
  loading: boolean = false;
  notifications: Notification[] = [];
  searchTerm: string = '';
  marcas = [
    {
      imagen: 'assets/marca1.jpg',
      url: 'https://www.facebook.com/tienda.de.arte.dc/',
    },
    {
      imagen: 'assets/marca2.jpg',
      url: 'https://www.facebook.com/p/Dekorfactory-100077738053069/',
    },
    {
      imagen: 'assets/marca3.jpg',
      url: 'https://www.facebook.com/decoracioneseventosmm/?locale=es_LA',
    },
  ];

  // Opciones para formularios
  tiposMantel = TIPOS_MANTEL;
  materiales = MATERIALES;
  categorias = CATEGORIAS;

  // Configuración para la tabla reutilizable
  tableColumns = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'material', label: 'Material' },
    { key: 'color', label: 'Color' },
    {
      key: 'precioAlquiler',
      label: 'Precio Alquiler',
      type: 'currency',
      format: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: 'stockDisponible',
      label: 'Stock',
      type: 'badge',
      format: (value: number) =>
        value > 10 ? 'bg-success' : value > 0 ? 'bg-warning' : 'bg-danger',
    },
    {
      key: 'disponible',
      label: 'Estado',
      type: 'boolean',
      format: (value: boolean) => (value ? 'Disponible' : 'No disponible'),
    },
    { key: 'categoria', label: 'Categoría' },
  ];

  // Formulario reactivo con VALIDACIONES
  servicioForm: FormGroup;

  constructor() {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      material: ['', Validators.required],
      color: ['', Validators.required],
      medidas: ['', Validators.required],
      precioAlquiler: [0, [Validators.required, Validators.min(0)]],
      precioVenta: [0, [Validators.min(0)]],
      stockDisponible: [0, [Validators.required, Validators.min(0)]],
      disponible: [true],
      categoria: ['', Validators.required],
      imagenUrl: [''],
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Cargar servicios desde el servicio
  /*cargarServicios(): void {
    this.loading = true;
    this.notifications = [];

    const sub = this.manteleriaService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
        this.loading = false;
        this.mostrarMensaje(`${servicios.length} servicios cargados`, 'info');
      },
      error: (error) => {
        console.error('Error cargando servicios:', error);
        this.loading = false;
        this.mostrarMensaje('Error al cargar los servicios', 'error');
      }
    });

    this.subscription.add(sub);
  }*/
  cargarServicios(): void {
    this.loading = true;
    this.manteleriaService.getServicios().subscribe({
      next: (datos: Manteles[]) => {
        this.servicios = datos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.mostrarMensaje('Error al cargar los servicios', 'error');
        this.loading = false;
      },
    });
  }

  // CRUD Operations
  crearServicio(): void {
    if (this.servicioForm.valid) {
      const nuevoServicio: Manteles = {
        id: 0, // El servicio asignará un ID
        ...this.servicioForm.value,
        fechaRegistro: new Date(),
      };

      this.loading = true;
      const sub = this.manteleriaService.crearServicio(nuevoServicio).subscribe({
        next: (servicioCreado) => {
          this.servicios.push(servicioCreado);
          this.servicioForm.reset();
          this.loading = false;
          this.mostrarMensaje('Servicio creado exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error creando servicio:', error);
          this.loading = false;
          this.mostrarMensaje('Error al crear el servicio', 'error');
        },
      });

      this.subscription.add(sub);
    } else {
      this.marcarFormularioComoSucio();
      this.mostrarMensaje(
        'Por favor, complete todos los campos requeridos correctamente',
        'warning',
      );
    }
  }

  actualizarServicio(): void {
    if (this.servicioForm.valid && this.servicioSeleccionado) {
      const servicioActualizado: Manteles = {
        ...this.servicioSeleccionado,
        ...this.servicioForm.value,
      };

      this.loading = true;
      const sub = this.manteleriaService.actualizarServicio(servicioActualizado).subscribe({
        next: (servicio) => {
          const index = this.servicios.findIndex((s) => s.id === servicio.id);
          if (index !== -1) {
            this.servicios[index] = servicio;
          }
          this.loading = false;
          this.mostrarMensaje('Servicio actualizado exitosamente', 'success');
          this.cancelarEdicion();
        },
        error: (error) => {
          console.error('Error actualizando servicio:', error);
          this.loading = false;
          this.mostrarMensaje('Error al actualizar el servicio', 'error');
        },
      });

      this.subscription.add(sub);
    }
  }

  eliminarServicio(servicio: Manteles): void {
    if (confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre}"?`)) {
      this.loading = true;
      const sub = this.manteleriaService.eliminarServicio(servicio.id).subscribe({
        next: (eliminado) => {
          if (eliminado) {
            this.servicios = this.servicios.filter((s) => s.id !== servicio.id);
            this.mostrarMensaje('Servicio eliminado exitosamente', 'warning');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error eliminando servicio:', error);
          this.loading = false;
          this.mostrarMensaje('Error al eliminar el servicio', 'error');
        },
      });

      this.subscription.add(sub);
    }
  }

  // Buscar servicios
  buscarServicios(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      const sub = this.manteleriaService.buscarServicios(this.searchTerm).subscribe({
        next: (resultados) => {
          this.servicios = resultados;
          this.loading = false;
          this.mostrarMensaje(`${resultados.length} resultados encontrados`, 'info');
        },
        error: (error) => {
          console.error('Error buscando:', error);
          this.loading = false;
        },
      });
      this.subscription.add(sub);
    } else {
      this.cargarServicios();
    }
  }

  servicioSeleccionadoParaVer: Manteles | null = null;
  modalVerVisible: boolean = false;

  // Manejar acciones de la tabla
  onTableAction(event: { action: string; item: Manteles }): void {
    const servicio = event.item;

    switch (event.action) {
      case 'edit':
        this.seleccionarServicio(servicio);
        break;
      case 'delete':
        this.eliminarServicio(servicio);
        break;
      case 'view':
        this.servicioSeleccionadoParaVer = servicio;
        this.modalVerVisible = true;
        break;
    }
  }
  // Método para cerrar modal
  cerrarModalVer(): void {
    this.modalVerVisible = false;
    this.servicioSeleccionadoParaVer = null;
  }

  // Métodos auxiliares para mostrar colores en el modal
  getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      Blanco: '#ffffff',
      Negro: '#000000',
      Rojo: '#dc3545',
      Azul: '#0d6efd',
      Verde: '#198754',
      Amarillo: '#ffc107',
      Morado: '#6f42c1',
      Rosa: '#d63384',
      Gris: '#6c757d',
      Beige: '#f5f5dc',
      Dorado: '#ffd700',
      Plateado: '#c0c0c0',
      Multicolor: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
    };

    return colorMap[colorName] || '#e9ecef';
  }

  getTextColor(colorName: string): string {
    const lightColors = ['Blanco', 'Amarillo', 'Beige', 'Dorado'];
    return lightColors.includes(colorName) ? '#000000' : '#ffffff';
  }

  seleccionarServicio(servicio: Manteles): void {
    this.servicioSeleccionado = { ...servicio };
    this.modoEdicion = true;
    this.servicioForm.patchValue(servicio);
    this.scrollToForm();
  }

  verServicio(servicio: Manteles): void {
    this.mostrarMensaje(`Viendo: ${servicio.nombre} - ${servicio.descripcion}`, 'info');
  }

  cancelarEdicion(): void {
    this.servicioSeleccionado = null;
    this.modoEdicion = false;
    this.servicioForm.reset({
      disponible: true,
      precioAlquiler: 0,
      precioVenta: 0,
      stockDisponible: 0,
    });
  }

  // Utilidades
  private marcarFormularioComoSucio(): void {
    Object.keys(this.servicioForm.controls).forEach((key) => {
      const control = this.servicioForm.get(key);
      control?.markAsTouched();
    });
  }

  private scrollToForm(): void {
    setTimeout(() => {
      const formElement = document.querySelector('.form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  private mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' | 'info' | 'warning' = 'success',
    duracion: number = 4000,
  ): void {
    const notification: Notification = {
      message: mensaje,
      type: tipo,
      duration: duracion,
    };

    this.notifications.push(notification);

    // Auto-eliminar después de la duración
    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, duracion);
  }

  // Getters para validación en template
  get nombre() {
    return this.servicioForm.get('nombre');
  }
  get descripcion() {
    return this.servicioForm.get('descripcion');
  }
  get tipo() {
    return this.servicioForm.get('tipo');
  }
  get material() {
    return this.servicioForm.get('material');
  }
  get color() {
    return this.servicioForm.get('color');
  }
  get precioAlquiler() {
    return this.servicioForm.get('precioAlquiler');
  }
  get stockDisponible() {
    return this.servicioForm.get('stockDisponible');
  }
  get categoria() {
    return this.servicioForm.get('categoria');
  }
}
