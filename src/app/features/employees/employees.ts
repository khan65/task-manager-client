import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Modal } from '../../core/ui/modal/modal';
import { OrgStructureService } from '../org-structure/org-structure.service';
import { Department, Designation, Grade } from '../org-structure/org-structure.models';
import { UsersService } from '../users/users.service';
import { UserSummary } from '../users/users.models';
import { EmployeesService } from './employees.service';
import { Employee } from './employees.models';

@Component({
  selector: 'app-employees',
  imports: [FormsModule, DatePipe, Modal],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  readonly employees = signal<Employee[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly designations = signal<Designation[]>([]);
  readonly grades = signal<Grade[]>([]);
  readonly users = signal<UserSummary[]>([]);
  readonly errorMessage = signal<string | null>(null);
  readonly showAddForm = signal(false);

  newFullName = '';
  newEmail = '';
  newPhone = '';
  newJoiningDate = '';
  newDepartmentId = '';
  newDesignationId = '';
  newGradeId = '';
  newUserId = '';

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly orgStructure: OrgStructureService,
    private readonly usersService: UsersService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reload();
    this.orgStructure.getDepartments().subscribe((v) => this.departments.set(v));
    this.orgStructure.getDesignations().subscribe((v) => this.designations.set(v));
    this.orgStructure.getGrades().subscribe((v) => this.grades.set(v));
    this.usersService.getUsers().subscribe((v) => this.users.set(v));
  }

  reload(): void {
    this.employeesService.getEmployees().subscribe((v) => this.employees.set(v));
  }

  addEmployee(): void {
    if (!this.newFullName || !this.newDepartmentId || !this.newDesignationId || !this.newGradeId || !this.newJoiningDate) {
      this.errorMessage.set('Name, joining date, department, designation, and grade are required.');
      return;
    }
    this.employeesService
      .createEmployee({
        fullName: this.newFullName,
        email: this.newEmail,
        phone: this.newPhone,
        joiningDate: new Date(this.newJoiningDate).toISOString(),
        isActive: true,
        departmentId: this.newDepartmentId,
        designationId: this.newDesignationId,
        gradeId: this.newGradeId,
        userId: this.newUserId || null,
      })
      .subscribe({
        next: (employee) => {
          this.employees.update((list) => [...list, employee]);
          this.newFullName = '';
          this.newEmail = '';
          this.newPhone = '';
          this.newJoiningDate = '';
          this.newDepartmentId = '';
          this.newDesignationId = '';
          this.newGradeId = '';
          this.newUserId = '';
          this.showAddForm.set(false);
        },
        error: () => this.errorMessage.set('Could not create employee — check the fields and try again.'),
      });
  }

  removeEmployee(employee: Employee): void {
    this.employeesService.deleteEmployee(employee.id).subscribe(() =>
      this.employees.update((list) => list.filter((e) => e.id !== employee.id)),
    );
  }
}
