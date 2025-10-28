import { Component, computed, effect, inject, ViewChild } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { Pagination } from '../pagination/pagination';
import { PaginationStore } from '../../stores/pagination-store';
import { UserApi } from '../../services/user-api';
import { SearchStore } from '../../stores/search-store';
import { UserOutput } from '../../models/user-output';
import { DeleteEntityModal } from "../delete-entity-modal/delete-entity-modal";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [AgGridModule, Pagination, DeleteEntityModal],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  pagination = inject(PaginationStore);
  userApi = inject(UserApi);
  searchStore = inject(SearchStore);
  router = inject(Router);

  @ViewChild(DeleteEntityModal) deleteModal!: DeleteEntityModal;

  // Computed: gefilterte + paginierte User
  readonly pagedUsers = computed(() => {
    const allFiltered = this.searchStore.filteredUsers();
    const page = this.pagination.currentPage();
    const perPage = this.pagination.itemsPerPage();
    const start = (page - 1) * perPage;
    return allFiltered.slice(start, start + perPage);
  });

  constructor() {
    this.userApi.getAllUsers();
    effect(() => {
      const total = this.searchStore.filteredUsers().length;
      this.pagination.setTotalItems(total);
    });
  }

  columns: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true, width: 70, editable: false },
    { field: 'name', headerName: 'Name', sortable: true, filter: true, flex: 1, editable: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true, flex: 1, editable: true },
    { field: 'createdAt', headerName: 'Created', sortable: true, flex: 1 },
    { field: 'updatedAt', headerName: 'Updated', sortable: true, flex: 1, resizable: false },
    {
      headerName: 'Actions',
      cellRenderer: (params: { data: { id: number; name: string } }) => {
        const container = document.createElement('div');
        container.classList.add('d-flex', 'justify-content-center', 'align-items-center');
        container.style.height = '100%';
        container.style.gap = '0.25rem';

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-secondary';
        editBtn.innerHTML = `<i class="bi bi-pen"></i>`;
        editBtn.addEventListener('click', () => {
          this.router.navigate([`/dashboard/users/${params.data.id}`]);
        });

        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-outline-danger';
        delBtn.innerHTML = `<i class="bi bi-trash"></i>`;
        delBtn.addEventListener('click', () => {
          console.log('Delete clicked', params.data);
          console.log('DeleteModal instance', this.deleteModal);
          this.deleteModal.open(params.data.id, params.data.name);
        });

        container.appendChild(editBtn);
        container.appendChild(delBtn);

        return container;
      },
      width: 80,
      resizable: false,
      suppressSizeToFit: true,
      pinned: 'right',
      suppressNavigable: true,
      sortable: false
    }
  ];

  onCellValueChanged(event: CellValueChangedEvent<UserOutput>) {
    const updatedUser = event.data;
    this.userApi.updateUser(updatedUser.id, {
      name: updatedUser.name,
      email: updatedUser.email
      // weitere Felder evtl hier hinzufügen
    }).then(result => {
      if (!result) {
        console.error('Update fehlgeschlagen!');
        event.node.setData(event.oldValue);
      }
    });
  }

  ngOnDestroy(): void {
    this.pagination.reset();
  }
}
