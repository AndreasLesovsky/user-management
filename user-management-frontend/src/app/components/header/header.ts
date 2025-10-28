import { Component, computed, inject, signal } from '@angular/core';
import { AuthApi } from '../../services/auth-api';
import { LogoutBtn } from "../logout-btn/logout-btn";
import { Router, RouterModule } from '@angular/router';
import { PaginationSize } from "../pagination-size/pagination-size";
import { Search } from "../search/search";

@Component({
  selector: 'app-header',
  imports: [RouterModule, LogoutBtn, PaginationSize, Search],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  auth = inject(AuthApi);
  private router = inject(Router);
  readonly currentUrl = signal(this.router.url);

  constructor() {
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  readonly isDashboard = computed(() => this.currentUrl().includes('/dashboard'));
}
