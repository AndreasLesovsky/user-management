import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserOutput } from '../models/user-output';
import { UserInput } from '../models/user-input';
import { firstValueFrom } from 'rxjs';
import { BASE_URL } from '../config/api.config';
import { MessageStore } from '../stores/message-store';

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${BASE_URL}`;
  private readonly apiUrl = `${this.baseUrl}/users`;
  private messageStore = inject(MessageStore);

  readonly users = signal<UserOutput[]>([]);

  // Helper: Auth Header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  // CREATE
  async createUser(input: UserInput): Promise<UserOutput | null> {
    try {
      const created = await firstValueFrom(
        this.http.post<UserOutput>(this.apiUrl, input, { headers: this.getAuthHeaders() })
      );
      this.users.update(users => [...users, created]);
      this.messageStore.addMessage('success', 'USER_CREATED');
      return created;
    } catch (error) {
      throw error;
    }
  }

  // READ ALL
  async getAllUsers(): Promise<void> {
    try {
      const all = await firstValueFrom(
        this.http.get<UserOutput[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      );
      this.users.set(all);
    } catch (error) {
      throw error;
    }
  }

  // READ BY ID
  async getUserById(id: number): Promise<UserOutput | null> {
    try {
      return await firstValueFrom(
        this.http.get<UserOutput>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      );
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  async updateUser(id: number, input: UserInput): Promise<UserOutput | null> {
    try {
      const updated = await firstValueFrom(
        this.http.put<UserOutput>(`${this.apiUrl}/${id}`, input, { headers: this.getAuthHeaders() })
      );
      this.users.update(users => users.map(u => (u.id === id ? updated : u)));
      this.messageStore.addMessage('success', 'USER_UPDATED');
      return updated;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  async deleteUser(id: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      );
      this.users.update(users => users.filter(u => u.id !== id));
      this.messageStore.addMessage('success', 'USER_DELETED');
      return true;
    } catch (error) {
      throw error;
    }
  }
}