import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Modal } from '../../core/ui/modal/modal';
import { ClientsService } from '../clients/clients.service';
import { ClientRecord } from '../clients/clients.models';
import { UsersService } from '../users/users.service';
import { UserSummary } from '../users/users.models';
import { ProjectsService } from './projects.service';
import { PROJECT_STATUSES, Project, ProjectStatus, ProjectType } from './projects.models';

type Tab = 'projects' | 'project-types';

@Component({
  selector: 'app-projects',
  imports: [FormsModule, DatePipe, Modal],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  readonly activeTab = signal<Tab>('projects');
  readonly showAddModal = signal(false);
  readonly statuses = PROJECT_STATUSES;

  readonly projects = signal<Project[]>([]);
  readonly projectTypes = signal<ProjectType[]>([]);
  readonly clients = signal<ClientRecord[]>([]);
  readonly users = signal<UserSummary[]>([]);
  readonly errorMessage = signal<string | null>(null);

  newTypeName = '';
  newTypeDescription = '';

  newProjectName = '';
  newProjectDescription = '';
  newProjectClientId = '';
  newProjectTypeId = '';
  newProjectDepartmentId = '';
  newProjectStartDate = '';
  newProjectEndDate = '';
  newProjectStatus: ProjectStatus = 'Planning';

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly clientsService: ClientsService,
    private readonly usersService: UsersService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reloadAll();
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  get addModalTitle(): string {
    return this.activeTab() === 'projects' ? 'Add Project' : 'Add Project Type';
  }

  reloadAll(): void {
    this.projectsService.getProjects().subscribe((v) => this.projects.set(v));
    this.projectsService.getProjectTypes().subscribe((v) => this.projectTypes.set(v));
    this.clientsService.getClients().subscribe((v) => this.clients.set(v));
    this.usersService.getUsers().subscribe((v) => this.users.set(v));
  }

  addProjectType(): void {
    this.projectsService.createProjectType(this.newTypeName, this.newTypeDescription).subscribe({
      next: (t) => {
        this.projectTypes.update((list) => [...list, t]);
        this.newTypeName = '';
        this.newTypeDescription = '';
        this.showAddModal.set(false);
      },
      error: () => this.errorMessage.set('Could not create project type.'),
    });
  }
  removeProjectType(id: string): void {
    this.projectsService.deleteProjectType(id).subscribe(() =>
      this.projectTypes.update((list) => list.filter((t) => t.id !== id)),
    );
  }

  addProject(): void {
    if (!this.newProjectClientId || !this.newProjectTypeId || !this.newProjectStartDate) {
      this.errorMessage.set('Client, project type, and start date are required.');
      return;
    }
    this.projectsService
      .createProject({
        name: this.newProjectName,
        description: this.newProjectDescription,
        clientId: this.newProjectClientId,
        projectTypeId: this.newProjectTypeId,
        departmentId: null,
        startDate: new Date(this.newProjectStartDate).toISOString(),
        endDate: this.newProjectEndDate ? new Date(this.newProjectEndDate).toISOString() : null,
        status: this.newProjectStatus,
      })
      .subscribe({
        next: (project) => {
          this.projects.update((list) => [project, ...list]);
          this.newProjectName = '';
          this.newProjectDescription = '';
          this.newProjectEndDate = '';
          this.showAddModal.set(false);
        },
        error: () => this.errorMessage.set('Could not create project.'),
      });
  }

  removeProject(id: string): void {
    this.projectsService.deleteProject(id).subscribe(() =>
      this.projects.update((list) => list.filter((p) => p.id !== id)),
    );
  }

  setStatus(project: Project, status: ProjectStatus): void {
    this.projectsService
      .updateProject(project.id, {
        name: project.name,
        description: project.description,
        clientId: project.clientId,
        projectTypeId: project.projectTypeId,
        departmentId: project.departmentId,
        startDate: project.startDate,
        endDate: project.endDate,
        status,
      })
      .subscribe({
        next: (updated) => this.projects.update((list) => list.map((p) => (p.id === updated.id ? updated : p))),
        error: () => this.errorMessage.set('Could not update status.'),
      });
  }

  isMember(project: Project, userId: string): boolean {
    return project.members.some((m) => m.userId === userId);
  }

  toggleMember(project: Project, user: UserSummary): void {
    const action = this.isMember(project, user.id)
      ? this.projectsService.removeMember(project.id, user.id)
      : this.projectsService.assignMember(project.id, user.id);

    action.subscribe({
      next: (updated) => this.projects.update((list) => list.map((p) => (p.id === updated.id ? updated : p))),
      error: () => this.errorMessage.set('Could not update project members.'),
    });
  }
}
