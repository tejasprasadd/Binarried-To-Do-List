import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../../core/api/api.config';
import type { LoginCredentials, LoginResponse } from '../auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'binaried.isLoggedIn';
  private readonly loggedIn = signal(this.readStoredLogin());

  readonly isLoggedIn = this.loggedIn.asReadonly();

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiBaseUrl}/login`, credentials)
      .pipe(tap((response) => this.setLoggedIn(response.isLoggedIn)));
  }

  logout(): void {
    this.setLoggedIn(false);
  }

  private readStoredLogin(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return localStorage.getItem(this.storageKey) === 'true';
  }

  private setLoggedIn(isLoggedIn: boolean): void {
    this.loggedIn.set(isLoggedIn);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, String(isLoggedIn));
    }
  }
}
