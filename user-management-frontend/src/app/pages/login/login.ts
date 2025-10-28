import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Spinner } from '../../components/spinner/spinner';
import { AuthApi } from '../../services/auth-api';
import { Router } from '@angular/router';
import { isLoading } from '../../interceptors/loading-interceptor';

@Component({
  selector: 'app-login',
  imports: [Spinner, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthApi);
  private router = inject(Router);

  loading = isLoading;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    await this.auth.login(email!, password!);
    await this.router.navigate(['/dashboard']);
  }
}