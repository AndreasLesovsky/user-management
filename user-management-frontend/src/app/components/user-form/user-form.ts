import { Component, computed, inject, signal } from '@angular/core';
import { UserApi } from '../../services/user-api';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserInput } from '../../models/user-input';
import { isLoading } from '../../interceptors/loading-interceptor';
import { Spinner } from "../spinner/spinner";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, Spinner],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private readonly userApi = inject(UserApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  loading = isLoading;

  // Signals für Mode
  private readonly userId = signal<number | null>(null);
  readonly isEditMode = computed(() => this.userId() !== null);

  // FormGroup
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('') // optional
  });

  constructor() {
    // Route prüfen
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId.set(+idParam);
      this.loadUser(+idParam);
    }
  }

  private async loadUser(id: number) {
    const user = await this.userApi.getUserById(id);
    if (user) {
      this.form.patchValue({
        name: user.name,
        email: user.email,
        password: '' // Passwort bleibt leer
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const input: UserInput = {
      name: this.form.value.name!,
      email: this.form.value.email!,
      password: this.form.value.password || null
    };

    if (this.isEditMode()) {
      const updated = await this.userApi.updateUser(this.userId()!, input);
      if (updated) {
        // zurück zur Liste
        this.router.navigate(['/dashboard/users']);
      }
    } else {
      const created = await this.userApi.createUser(input);
      if (created) {
        this.form.reset();
      }
    }
  }
}