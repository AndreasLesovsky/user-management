import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageStore } from '../stores/message-store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageStore = inject(MessageStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const code = error.error?.errorType ?? 'UNKNOWN_ERROR';
      messageStore.addMessage('error', code, error.status);
      return throwError(() => error);
    })
  );
};