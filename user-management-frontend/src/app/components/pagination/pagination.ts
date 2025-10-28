import { Component, inject } from '@angular/core';
import { PaginationStore } from '../../stores/pagination-store';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  pagination = inject(PaginationStore);

  readonly currentPage = this.pagination.currentPage;
  readonly totalPages = this.pagination.totalPages;
  readonly pagesList = this.pagination.pagesList;

  readonly previous = this.pagination.previous;
  readonly next = this.pagination.next;
  readonly changePage = this.pagination.changePage;
}
