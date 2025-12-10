import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { NotificationComponent, Notification } from './components/shared/notification/notification';

@Component({
  selector: 'app-root',
  imports: [RouterModule, RouterOutlet, RouterLink, RouterLinkActive, NotificationComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],  // CORREGIDO
})
export class App {
  protected readonly title = signal('Eventos Elegantes');
  notifications: Notification[] = [];
  year: number = new Date().getFullYear(); // Para mostrar el año automáticamente

  mostrarProximamente(seccion: string): void {
    const notification: Notification = {
      message: `La sección "${seccion}" estará disponible próximamente`,
      type: 'success',
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
