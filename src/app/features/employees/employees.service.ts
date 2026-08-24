import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee } from './employees.models';

const base = environment.apiBaseUrl;

export interface UpsertEmployeePayload {
  fullName: string;
  email: string;
  phone: string;
  joiningDate: string;
  isActive: boolean;
  departmentId: string;
  designationId: string;
  gradeId: string;
  userId: string | null;
}

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  constructor(private readonly http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${base}/employees`);
  }
  createEmployee(payload: UpsertEmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(`${base}/employees`, payload);
  }
  updateEmployee(id: string, payload: UpsertEmployeePayload): Observable<Employee> {
    return this.http.put<Employee>(`${base}/employees/${id}`, payload);
  }
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/employees/${id}`);
  }
}
