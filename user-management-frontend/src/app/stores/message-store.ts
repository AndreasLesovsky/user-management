import { Injectable, signal } from '@angular/core';
import { AppMessage } from '../models/app-message';

@Injectable({ providedIn: 'root' })
export class MessageStore {
  private _messages = signal<AppMessage[]>([]);
  private _idCounter = 0;
  private readonly MAX_TOASTS = 4;

  readonly messages = this._messages.asReadonly();

  addMessage(type: 'error' | 'success', code: string, status?: number): void {
    const id = ++this._idCounter;
    const msg = { id, type, code, status };

    this._messages.update(list => {
      const updated = [...list, msg];

      // Wenn mehr als MAX_TOASTS → älteste zuerst entfernen
      if (updated.length > this.MAX_TOASTS) {
        updated.shift();
      }

      return updated;
    });

    // Toast mit Bootstrap anzeigen
    setTimeout(() => {
      const toastEl = document.getElementById(`toast-${id}`);
      if (toastEl) {
        const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
        bsToast.show();
      }
    }, 0);
  }

  removeMessage(id: number): void {
    this._messages.update(list => list.filter(m => m.id !== id));
  }

  clear(): void {
    this._messages.set([]);
  }
}
