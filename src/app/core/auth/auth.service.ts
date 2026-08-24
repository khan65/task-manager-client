import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from './auth.models';

const STORAGE_KEY = 'tm.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentSession = signal<AuthResponse | null>(this.readStoredSession());

  readonly isAuthenticated = computed(() => this.currentSession() !== null);
  readonly currentUser = computed(() => this.currentSession());
  readonly isAdmin = computed(() => (this.currentSession()?.roles ?? []).includes('Admin'));

  constructor(private readonly http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, request)
      .pipe(tap((session) => this.storeSession(session)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, request)
      .pipe(tap((session) => this.storeSession(session)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentSession.set(null);
  }

  get token(): string | null {
    return this.currentSession()?.token ?? null;
  }

  private storeSession(session: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.currentSession.set(session);
  }

  private readStoredSession(): AuthResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }
}
