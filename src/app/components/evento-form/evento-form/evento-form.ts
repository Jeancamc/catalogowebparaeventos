// componentes/evento-form/evento-form.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { EventoService } from '../../../services/serv-eventos-json';
import { ServManteleria } from '../../../services/serv-manteleria-api';
import { ServMusicaApi } from '../../../services/serv-musica-api';
import { ServDecoracionApi } from '../../../services/serv-decoracion-api';
import { ServAnimacionApi } from '../../../services/serv-animacion-api';
import { ServSalonesApi } from '../../../services/serv-salones-api';
import { Salon } from '../../../models/salon';
import { Animacion } from '../../../models/animacion';
import { Decoracion } from '../../../models/deco';
import { Musica } from '../../../models/musica';
import { Manteles } from '../../../models/manteleriamodel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class EventoFormComponent implements OnInit {
  eventoForm: FormGroup;
  serviciosDisponibles = {
    salones: [] as Salon[],
    animaciones: [] as Animacion[],
    decoraciones: [] as Decoracion[],
    musicas: [] as Musica[],
    mantelerias: [] as Manteles[],
  };

  totalCalculado = 0;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private salonService: ServSalonesApi,
    private animacionService: ServAnimacionApi,
    private decoracionService: ServDecoracionApi,
    private musicaService: ServMusicaApi,
    private mantelesServices: ServManteleria,
  ) {
    this.eventoForm = this.createForm();
  }

  ngOnInit() {
    this.cargarServicios();
    this.setupCalculos();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      fechaEvento: ['', Validators.required],
      descripcion: [''],
      numeroInvitados: [1, [Validators.required, Validators.min(1)]],
      estado: ['Pendiente'],

      salonId: [null],
      animacionId: [null],
      decoracionId: [null],
      musicaId: [null],

      detallesManteleria: this.fb.array([]),

      clienteNombre: ['', Validators.required],
      clienteTelefono: ['', Validators.required],
      clienteEmail: ['', [Validators.required, Validators.email]],

      anticipo: [0, Validators.min(0)],
    });
  }

  get detallesManteleria(): FormArray {
    return this.eventoForm.get('detallesManteleria') as FormArray;
  }

  agregarManteleria(): void {
    const detalleForm = this.fb.group({
      servicioManteleriaId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [{ value: 0, disabled: true }],
      subtotal: [{ value: 0, disabled: true }],
    });

    this.detallesManteleria.push(detalleForm);
  }

  removerManteleria(index: number): void {
    this.detallesManteleria.removeAt(index);
    this.calcularTotal();
  }

  private cargarServicios(): void {
    // Cargar todos los servicios disponibles
    this.salonService.getAll().subscribe((salones) => {
      this.serviciosDisponibles.salones = salones;
    });

    this.animacionService.getAll().subscribe((animaciones) => {
      this.serviciosDisponibles.animaciones = animaciones;
    });

    this.decoracionService.getDecoracion().subscribe((decoraciones) => {
      this.serviciosDisponibles.decoraciones = decoraciones;
    });

    this.musicaService.getAll().subscribe((musicas) => {
      this.serviciosDisponibles.musicas = musicas;
    });

    this.mantelesServices.getServicios().subscribe((mantelerias) => {
      this.serviciosDisponibles.mantelerias = mantelerias;
    });
  }

  private setupCalculos(): void {
    // Recalcular cuando cambien los servicios
    this.eventoForm.get('salonId')?.valueChanges.subscribe(() => this.calcularTotal());
    this.eventoForm.get('animacionId')?.valueChanges.subscribe(() => this.calcularTotal());
    this.eventoForm.get('decoracionId')?.valueChanges.subscribe(() => this.calcularTotal());
    this.eventoForm.get('musicaId')?.valueChanges.subscribe(() => this.calcularTotal());

    // Recalcular cuando cambie la mantelería
    this.detallesManteleria.valueChanges.subscribe(() => this.calcularTotal());
  }

  calcularTotal(): void {
    let total = 0;

    // Sumar servicios individuales
    const salonId = this.eventoForm.get('salonId')?.value;
    const animacionId = this.eventoForm.get('animacionId')?.value;
    const decoracionId = this.eventoForm.get('decoracionId')?.value;
    const musicaId = this.eventoForm.get('musicaId')?.value;

    if (salonId) {
      const salon = this.serviciosDisponibles.salones.find((s) => s.id === salonId);
      // Suponiendo 4 horas por evento
      total += salon ? salon.precioHora * 4 : 0;
    }

    if (animacionId) {
      const animacion = this.serviciosDisponibles.animaciones.find((a) => a.id === animacionId);
      total += animacion ? animacion.precioPorEvento : 0;
    }

    if (decoracionId) {
      const decoracion = this.serviciosDisponibles.decoraciones.find((d) => d.id === decoracionId);
      total += decoracion ? decoracion.precioPorEvento : 0;
    }

    if (musicaId) {
      const musica = this.serviciosDisponibles.musicas.find((m) => m.id === musicaId);
      // Suponiendo 4 horas por evento
      total += musica ? musica.precioPorHora * 4 : 0;
    }

    // Sumar mantelería
    this.detallesManteleria.controls.forEach((detalle, index) => {
      const servicioId = detalle.get('servicioManteleriaId')?.value;
      const cantidad = detalle.get('cantidad')?.value || 0;

      if (servicioId) {
        const manteleria = this.serviciosDisponibles.mantelerias.find((m) => m.id === servicioId);
        if (manteleria) {
          const precio = manteleria.precioAlquiler;
          const subtotal = precio * cantidad;

          // Actualizar el formulario
          detalle.get('precioUnitario')?.setValue(precio, { emitEvent: false });
          detalle.get('subtotal')?.setValue(subtotal, { emitEvent: false });

          total += subtotal;
        }
      }
    });

    this.totalCalculado = total;
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      const eventoData = this.prepareEventoData();

      this.eventoService.create(eventoData).subscribe({
        next: (eventoCreado) => {
          console.log('Evento creado:', eventoCreado);
          // Resetear formulario o redirigir
          this.eventoForm.reset();
          this.detallesManteleria.clear();
        },
        error: (error) => {
          console.error('Error creando evento:', error);
        },
      });
    }
  }

  private prepareEventoData(): any {
    const formValue = this.eventoForm.getRawValue();

    // Preparar detalles de mantelería
    const detallesManteleria = formValue.detallesManteleria.map((detalle: any) => ({
      servicioManteleriaId: detalle.servicioManteleriaId,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precioUnitario,
    }));

    return {
      ...formValue,
      detallesManteleria,
      costoTotal: this.totalCalculado,
      saldoPendiente: this.totalCalculado - (formValue.anticipo || 0),
    };
  }
}
