import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css']
})
export class SimpleTableComponent {
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() columns: any[] = [];
  @Input() pageSize: number = 5;
  @Input() showPagination: boolean = true;
  @Input() showActions: boolean = true;
  
  @Output() action = new EventEmitter<{action: string, item: any}>();

  private currentPage = 1;

  // Métodos simples para el template
  getColumns() {
    return this.columns || [];
  }

  getData() {
    return this.data || [];
  }

  getPaginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.getData().slice(start, end);
  }

  hasActions() {
    return this.showActions;
  }

  shouldShowPagination() {
    return this.showPagination && this.getData().length > this.pageSize;
  }

  getTotalPages() {
    return Math.ceil(this.getData().length / this.pageSize);
  }

  getCurrentPage() {
    return this.currentPage;
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  isLastPage() {
    return this.currentPage === this.getTotalPages();
  }

  nextPage() {
    if (!this.isLastPage()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (!this.isFirstPage()) {
      this.currentPage--;
    }
  }

  handleAction(action: string, item: any) {
    this.action.emit({ action, item });
  }
}