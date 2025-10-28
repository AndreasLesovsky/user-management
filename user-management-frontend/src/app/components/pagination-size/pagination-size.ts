import { Component, inject } from '@angular/core';
import { PaginationStore } from '../../stores/pagination-store';

@Component({
  selector: 'app-pagination-size',
  imports: [],
  templateUrl: './pagination-size.html',
  styleUrl: './pagination-size.scss',
})
export class PaginationSize {
  pagination = inject(PaginationStore);

  onItemsPerPageSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    this.pagination.updateItemsPerPage(value);
  }
}
