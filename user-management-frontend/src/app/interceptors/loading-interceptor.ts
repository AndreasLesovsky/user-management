import { HttpInterceptorFn } from '@angular/common/http';
import { signal } from '@angular/core';
import { finalize } from 'rxjs';

export const isLoading = signal(false);

// Konfiguration
const SHOW_DELAY = 120; // ms bis Spinner angezeigt wird
const MIN_DURATION = 200; // ms Mindestdauer, wenn Spinner einmal sichtbar ist

let activeRequests = 0;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let spinnerVisibleSince: number | null = null;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Neuen Request zählen
  activeRequests++;

  // Falls das der erste aktive Request ist → Show-Delay starten
  if (activeRequests === 1) {
    clearTimeout(hideTimer ?? undefined);
    showTimer = setTimeout(() => {
      isLoading.set(true);
      spinnerVisibleSince = Date.now();
    }, SHOW_DELAY);
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests = Math.max(0, activeRequests - 1);

      // Wenn keine Requests mehr laufen → Spinner evtl. ausblenden
      if (activeRequests === 0) {
        clearTimeout(showTimer ?? undefined);

        const now = Date.now();

        if (spinnerVisibleSince) {
          const elapsed = now - spinnerVisibleSince;
          const remaining = Math.max(MIN_DURATION - elapsed, 0);

          hideTimer = setTimeout(() => {
            isLoading.set(false);
            spinnerVisibleSince = null;
          }, remaining);
        } else {
          // Spinner wurde nie gezeigt (Request war zu schnell)
          isLoading.set(false);
        }
      }
    })
  );
};
