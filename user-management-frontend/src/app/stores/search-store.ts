import { computed, inject, Injectable, signal } from '@angular/core';
import { UserApi } from '../services/user-api';

@Injectable({
  providedIn: 'root'
})
export class SearchStore {
  userApi = inject(UserApi);
  readonly users = this.userApi.users;

  // Filter + Sort State
  readonly searchQuery = signal('');

  // Computed
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) return this.users(); // kein Filter

    // Filter alle User nach Name
    return this.users().filter(user => user.name.toLowerCase().includes(query));
  });
}
