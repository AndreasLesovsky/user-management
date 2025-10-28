import { Component, inject } from '@angular/core';
import { SearchStore } from '../../stores/search-store';
import { PaginationStore } from '../../stores/pagination-store';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  searchStore = inject(SearchStore);
  paginationStore = inject(PaginationStore);

  onSearchChange(value: string) {
    this.searchStore.searchQuery.set(value);
    this.paginationStore.currentPage.set(1);
  }
}
