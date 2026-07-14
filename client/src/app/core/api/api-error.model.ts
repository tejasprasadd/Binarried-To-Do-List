import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorResponse {
  message?: string;
  details?: Record<string, string>;
}

export function readApiError(error: unknown): ApiErrorResponse {
  return error instanceof HttpErrorResponse && error.error && typeof error.error === 'object'
    ? error.error as ApiErrorResponse
    : {};
}
