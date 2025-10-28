import { Component, inject, signal } from '@angular/core';
import { UserApi } from '../../services/user-api';
@Component({
  selector: 'app-delete-entity-modal',
  imports: [],
  templateUrl: './delete-entity-modal.html',
  styleUrl: './delete-entity-modal.scss',
})
export class DeleteEntityModal {
  private readonly userApi = inject(UserApi);

  readonly userId = signal<number | null>(null);
  readonly userName = signal<string>('');

  open(id: number, name: string): void {
    this.userId.set(id);
    this.userName.set(name);

    const el = document.getElementById('confirmDeleteModal');
    if (!el) return;

    const modal = (window as any).bootstrap.Modal.getOrCreateInstance(el);
    modal.show();
  }

  async confirmDelete(): Promise<void> {
    const id = this.userId();
    if (id == null) return;

    const success = await this.userApi.deleteUser(id);
    if (success) {
      const el = document.getElementById('confirmDeleteModal');
      const modal = (window as any).bootstrap.Modal.getInstance(el);
      modal?.hide();
    }
  }

}
