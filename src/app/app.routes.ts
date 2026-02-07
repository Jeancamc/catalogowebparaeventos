import { Routes } from '@angular/router';
import { ManteleriaComponent } from './components/manteleria/manteles/manteles';
import { Inicio } from './components/inicio/inicio';
import { SalonesComponent } from './components/salones/salones';
import { DecoracionCrud } from './components/decoracion-crud/decoracion-crud';
import { MusicaComponent } from './components/musica/musica';
import { AnimacionComponent } from './components/animacion/animacion';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'manteleria', component: ManteleriaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'salones', component: SalonesComponent },
  { path: 'decoracion-crud', component: DecoracionCrud },
  { path: 'musica', component: MusicaComponent },
  { path: 'animacion', component: AnimacionComponent },
  { path: '**', redirectTo: 'inicio' }, // fallback por si se ingresa ruta inválida
];
