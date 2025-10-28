import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from '../../services/auth-api';
import { isLoading } from '../../interceptors/loading-interceptor';
import { Spinner } from '../spinner/spinner';

@Component({
  selector: 'app-logout-btn',
  imports: [Spinner],
  templateUrl: './logout-btn.html',
  styleUrl: './logout-btn.scss',
})
export class LogoutBtn {
  auth = inject(AuthApi);
  private router = inject(Router);
  error = signal<string | null>(null);
  loading = isLoading;

  async logout(): Promise<void> {
    this.error.set(null);
    try {
      await this.auth.logout();
      await this.router.navigate(['/']);
    } catch (err) {
      this.error.set('Logout fehlgeschlagen. Bitte versuche es erneut.');
    }
  }
}
