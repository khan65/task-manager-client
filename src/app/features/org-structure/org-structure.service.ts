import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department, Designation, Grade, Organization } from './org-structure.models';

const base = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class OrgStructureService {
  constructor(private readonly http: HttpClient) {}

  // Organizations
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${base}/organizations`);
  }
  createOrganization(name: string, description: string): Observable<Organization> {
    return this.http.post<Organization>(`${base}/organizations`, { name, description });
  }
  deleteOrganization(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/organizations/${id}`);
  }

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${base}/departments`);
  }
  createDepartment(name: string, description: string, organizationId: string): Observable<Department> {
    return this.http.post<Department>(`${base}/departments`, { name, description, organizationId });
  }
  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/departments/${id}`);
  }

  // Designations
  getDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(`${base}/designations`);
  }
  createDesignation(title: string, description: string): Observable<Designation> {
    return this.http.post<Designation>(`${base}/designations`, { title, description });
  }
  deleteDesignation(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/designations/${id}`);
  }

  // Grades
  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${base}/grades`);
  }
  createGrade(name: string, level: number, description: string): Observable<Grade> {
    return this.http.post<Grade>(`${base}/grades`, { name, level, description });
  }
  deleteGrade(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/grades/${id}`);
  }
}
