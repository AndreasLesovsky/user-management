import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './interceptors/loading-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core platform features
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    // Http
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor, errorInterceptor])
    ),

    // Router
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
  ]
};
