import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { OrgStructureService } from './org-structure.service';
import { Department, Designation, Grade, Organization } from './org-structure.models';

type Tab = 'organizations' | 'departments' | 'designations' | 'grades';

@Component({
  selector: 'app-org-structure',
  imports: [FormsModule],
  templateUrl: './org-structure.html',
  styleUrl: './org-structure.css',
})
export class OrgStructure implements OnInit {
  readonly activeTab = signal<Tab>('organizations');

  readonly organizations = signal<Organization[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly designations = signal<Designation[]>([]);
  readonly grades = signal<Grade[]>([]);
  readonly errorMessage = signal<string | null>(null);

  // new-item form fields
  newOrgName = '';
  newOrgDescription = '';
  newDeptName = '';
  newDeptDescription = '';
  newDeptOrgId = '';
  newDesignationTitle = '';
  newDesignationDescription = '';
  newGradeName = '';
  newGradeLevel = 1;
  newGradeDescription = '';

  constructor(
    private readonly orgStructure: OrgStructureService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reloadAll();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  reloadAll(): void {
    this.orgStructure.getOrganizations().subscribe((v) => this.organizations.set(v));
    this.orgStructure.getDepartments().subscribe((v) => this.departments.set(v));
    this.orgStructure.getDesignations().subscribe((v) => this.designations.set(v));
    this.orgStructure.getGrades().subscribe((v) => this.grades.set(v));
  }

  addOrganization(): void {
    this.orgStructure.createOrganization(this.newOrgName, this.newOrgDescription).subscribe({
      next: (org) => {
        this.organizations.update((list) => [...list, org]);
        this.newOrgName = '';
        this.newOrgDescription = '';
      },
      error: () => this.errorMessage.set('Could not create organization.'),
    });
  }

  removeOrganization(id: string): void {
    this.orgStructure.deleteOrganization(id).subscribe(() => {
      this.organizations.update((list) => list.filter((o) => o.id !== id));
      this.departments.update((list) => list.filter((d) => d.organizationId !== id));
    });
  }

  addDepartment(): void {
    if (!this.newDeptOrgId) {
      this.errorMessage.set('Pick an organization first.');
      return;
    }
    this.orgStructure.createDepartment(this.newDeptName, this.newDeptDescription, this.newDeptOrgId).subscribe({
      next: (dept) => {
        this.departments.update((list) => [...list, dept]);
        this.newDeptName = '';
        this.newDeptDescription = '';
      },
      error: () => this.errorMessage.set('Could not create department.'),
    });
  }

  removeDepartment(id: string): void {
    this.orgStructure.deleteDepartment(id).subscribe(() =>
      this.departments.update((list) => list.filter((d) => d.id !== id)),
    );
  }

  addDesignation(): void {
    this.orgStructure.createDesignation(this.newDesignationTitle, this.newDesignationDescription).subscribe({
      next: (d) => {
        this.designations.update((list) => [...list, d]);
        this.newDesignationTitle = '';
        this.newDesignationDescription = '';
      },
      error: () => this.errorMessage.set('Could not create designation.'),
    });
  }

  removeDesignation(id: string): void {
    this.orgStructure.deleteDesignation(id).subscribe(() =>
      this.designations.update((list) => list.filter((d) => d.id !== id)),
    );
  }

  addGrade(): void {
    this.orgStructure.createGrade(this.newGradeName, this.newGradeLevel, this.newGradeDescription).subscribe({
      next: (g) => {
        this.grades.update((list) => [...list, g].sort((a, b) => a.level - b.level));
        this.newGradeName = '';
        this.newGradeDescription = '';
        this.newGradeLevel = 1;
      },
      error: () => this.errorMessage.set('Could not create grade.'),
    });
  }

  removeGrade(id: string): void {
    this.orgStructure.deleteGrade(id).subscribe(() =>
      this.grades.update((list) => list.filter((g) => g.id !== id)),
    );
  }
}
