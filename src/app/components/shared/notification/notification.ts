import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationComponent {
  @Input() notifications: Notification[] = [];
  
  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }
  
  getIcon(type: string): string {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  }
}