import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginHistoryEntry } from './login-history.models';

const base = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class LoginHistoryService {
  constructor(private readonly http: HttpClient) {}

  getLoginHistory(): Observable<LoginHistoryEntry[]> {
    return this.http.get<LoginHistoryEntry[]>(`${base}/auth/login-history`);
  }
}
