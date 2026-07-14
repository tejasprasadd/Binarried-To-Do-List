import { InjectionToken, Provider } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export function provideApiConfig(): Provider {
  return {
    provide: API_BASE_URL,
    useValue: 'http://localhost:3000/api',
  };
}
