import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from '../config/api.config';
import { MessageStore } from '../stores/message-store';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private http = inject(HttpClient);
  loginSuccess = signal<boolean | null>(null);
  private baseUrl = `${BASE_URL}`;
  private apiUrl = `${this.baseUrl}/auth`;
  private messageStore = inject(MessageStore);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  // Login
  async login(email: string, password: string): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password })
      );

      if (response?.token) {
        localStorage.setItem('token', response.token);
        this.loginSuccess.set(true);
        this.messageStore.addMessage('success', 'LOGIN_SUCCESS');
      } else {
        this.loginSuccess.set(false);
      }

      return response;
    } catch (error) {
      this.loginSuccess.set(false);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/logout`, {}) // Header entfernt
      );
      localStorage.removeItem('token');
      this.loginSuccess.set(null);
      this.messageStore.addMessage('success', 'LOGOUT_SUCCESS');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Token check + Backend Timer zurücksetzen
  async getMe(): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/check`, { headers: this.getAuthHeaders() })
      );

      // Backend liefert id, name, email, token
      if (response?.id && response?.email) {
        this.loginSuccess.set(true);

        // neuen Token vom Backend übernehmen
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        return response;
      } else {
        this.loginSuccess.set(false);
        return null;
      }

    } catch (error) {
      this.loginSuccess.set(false);
      throw error;
    }
  }


}
