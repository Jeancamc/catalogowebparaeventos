import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ServDecoracionJson } from '../../services/serv-decoracion-json';
import { Decoracion } from '../../models/deco';
import { Card } from '../shared/card/card';
import { NotificationComponent, Notification } from '../shared/notification/notification';

@Component({
  selector: 'app-decoracion-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, Card, NotificationComponent,],
  templateUrl: './decoracion-crud.html',
  styleUrls: ['./decoracion-crud.css']
})
export class DecoracionCrud implements OnInit {
  decoraciones: Decoracion[] = [];
  notifications: Notification[] = [];
  formDecoracion!: FormGroup;
  editingId: number | null = null;
  formVisible: boolean = false;
  vistaCards: boolean = true;
  mensaje: string = '';

  constructor(private servDecoracion: ServDecoracionJson, private fb: FormBuilder) {
    this.formDecoracion = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      tipo: ['', Validators.required],
      precioPorEvento: [0, [Validators.required, Validators.min(1)]],
      empresaProveedor: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      disponible: [true],
      imagen: [''] // opcional
    });
  }

  ngOnInit(): void {
    this.loadDecoraciones();
  }

  loadDecoraciones(): void {
    this.servDecoracion.getDecoracion().subscribe({
      next: data => this.decoraciones = data,
      error: () => this.addNotification('Error cargando decoraciones', 'error')
    });
  }

  showForm(): void {
    this.formVisible = true;
    this.editingId = null;
    this.formDecoracion.reset({ disponible: true });
  }

  hideForm(): void {
    this.formVisible = false;
  }

  toggleVista(): void {
    this.vistaCards = !this.vistaCards;
  }

  addNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    this.notifications.push({ message, type });
    setTimeout(() => {
      this.notifications.shift();
    }, 5000);
  }

  save(): void {
    if (this.formDecoracion.invalid) {
    this.formDecoracion.markAllAsTouched(); // Marca campos inválidos
    this.addNotification('Formulario inválido. Revisa los campos.', 'error'); // Muestra notificación
    return;
  }

    const datos: Decoracion = { ...this.formDecoracion.value, id: this.editingId ?? undefined };

    if (this.editingId) {
      this.servDecoracion.update(datos).subscribe({
        next: () => {
          this.addNotification('Decoración actualizada con éxito', 'success');
          this.hideForm();
          this.loadDecoraciones();
        },
        error: () => this.addNotification('Error al actualizar decoración', 'error')
      });
    } else {
      this.servDecoracion.create(datos).subscribe({
        next: () => {
          this.addNotification('Decoración creada con éxito', 'success');
          this.hideForm();
          this.loadDecoraciones();
        },
        error: () => this.addNotification('Error al crear decoración', 'error')
      });
    }
  }

  editDecoracion(deco: Decoracion): void {
    this.editingId = deco.id;
    this.formDecoracion.patchValue(deco);
    this.formVisible = true;
  }

  delete(deco: Decoracion): void {
    if (confirm(`¿Eliminar decoración ${deco.nombre}?`)) {
      this.servDecoracion.delete(deco.id).subscribe({
        next: () => {
          this.addNotification('Decoración eliminada con éxito', 'success');
          this.loadDecoraciones();
        },
        error: () => this.addNotification('Error al eliminar decoración', 'error')
      });
    }
  }

  search(param: string): void {
    if (!param) {
      this.loadDecoraciones();
      return;
    }
    this.servDecoracion.searchDecoracion(param).subscribe({
      next: data => this.decoraciones = data,
      error: () => this.addNotification('Error buscando decoración', 'error')
    });
  }
}
