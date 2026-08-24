import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult, RoleSummary, UserSummary } from './users.models';

const base = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  /** Full unpaginated list — for dropdowns/pickers elsewhere (project members, task assignees). */
  getUsers(): Observable<UserSummary[]> {
    return this.getUsersPaged(1, 100).pipe(map((result) => result.items));
  }

  /** Reference implementation of the shared pagination/filtering convention (see backend PagedResult.cs). */
  getUsersPaged(page: number, pageSize: number, search?: string): Observable<PagedResult<UserSummary>> {
    const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) };
    if (search) params['search'] = search;
    return this.http.get<PagedResult<UserSummary>>(`${base}/users`, { params });
  }

  getRoles(): Observable<RoleSummary[]> {
    return this.http.get<RoleSummary[]>(`${base}/users/roles`);
  }

  assignRole(userId: string, roleId: string): Observable<UserSummary> {
    return this.http.post<UserSummary>(`${base}/users/${userId}/roles`, { roleId });
  }

  removeRole(userId: string, roleId: string): Observable<UserSummary> {
    return this.http.delete<UserSummary>(`${base}/users/${userId}/roles/${roleId}`);
  }
}
