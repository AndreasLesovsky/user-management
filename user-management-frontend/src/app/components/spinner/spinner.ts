import { Component } from '@angular/core';
import { isLoading } from '../../interceptors/loading-interceptor';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
  isLoading = isLoading;
}
