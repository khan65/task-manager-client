import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectStatus, ProjectType } from './projects.models';

const base = environment.apiBaseUrl;

export interface UpsertProjectPayload {
  name: string;
  description: string;
  clientId: string;
  projectTypeId: string;
  departmentId: string | null;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private readonly http: HttpClient) {}

  getProjectTypes(): Observable<ProjectType[]> {
    return this.http.get<ProjectType[]>(`${base}/project-types`);
  }
  createProjectType(name: string, description: string): Observable<ProjectType> {
    return this.http.post<ProjectType>(`${base}/project-types`, { name, description });
  }
  deleteProjectType(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/project-types/${id}`);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${base}/projects`);
  }
  createProject(payload: UpsertProjectPayload): Observable<Project> {
    return this.http.post<Project>(`${base}/projects`, payload);
  }
  updateProject(id: string, payload: UpsertProjectPayload): Observable<Project> {
    return this.http.put<Project>(`${base}/projects/${id}`, payload);
  }
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/projects/${id}`);
  }
  assignMember(projectId: string, userId: string): Observable<Project> {
    return this.http.post<Project>(`${base}/projects/${projectId}/members`, { userId });
  }
  removeMember(projectId: string, userId: string): Observable<Project> {
    return this.http.delete<Project>(`${base}/projects/${projectId}/members/${userId}`);
  }
}
