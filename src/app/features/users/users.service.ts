import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleSummary, UserSummary } from './users.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${environment.apiBaseUrl}/users`);
  }

  getRoles(): Observable<RoleSummary[]> {
    return this.http.get<RoleSummary[]>(`${environment.apiBaseUrl}/users/roles`);
  }

  assignRole(userId: string, roleId: string): Observable<UserSummary> {
    return this.http.post<UserSummary>(`${environment.apiBaseUrl}/users/${userId}/roles`, { roleId });
  }

  removeRole(userId: string, roleId: string): Observable<UserSummary> {
    return this.http.delete<UserSummary>(`${environment.apiBaseUrl}/users/${userId}/roles/${roleId}`);
  }
}
