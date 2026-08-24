import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Modal } from '../../core/ui/modal/modal';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/projects.models';
import { UsersService } from '../users/users.service';
import { UserSummary } from '../users/users.models';
import { OrgStructureService } from '../org-structure/org-structure.service';
import { Department } from '../org-structure/org-structure.models';
import { TasksService } from './tasks.service';
import {
  PagedResult,
  Priority,
  ProjectTask,
  TaskAttachment,
  TaskCategory,
  TaskDiscussion,
  TaskFrequency,
  TaskRole,
  TaskSearchFilters,
  TaskState,
  TaskStateHistoryEntry,
  TaskStateTabCount,
  TaskSubCategory,
  TaskType,
} from './tasks.models';

type View = 'board' | 'list';
type StatusTab = 'all' | 'removed' | string; // string = a state id

const PAGE_SIZE = 15;

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, DatePipe, Modal],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  readonly view = signal<View>('board');

  readonly projects = signal<Project[]>([]);
  readonly selectedProjectId = signal<string>('');

  readonly states = signal<TaskState[]>([]);
  readonly tasks = signal<ProjectTask[]>([]);
  readonly categories = signal<TaskCategory[]>([]);
  readonly subCategories = signal<TaskSubCategory[]>([]);
  readonly taskTypes = signal<TaskType[]>([]);
  readonly taskRoles = signal<TaskRole[]>([]);
  readonly priorities = signal<Priority[]>([]);
  readonly frequencies = signal<TaskFrequency[]>([]);
  readonly departments = signal<Department[]>([]);
  readonly users = signal<UserSummary[]>([]);
  readonly errorMessage = signal<string | null>(null);

  readonly expandedTaskId = signal<string | null>(null);
  readonly discussions = signal<TaskDiscussion[]>([]);
  readonly stateHistory = signal<TaskStateHistoryEntry[]>([]);
  readonly attachments = signal<TaskAttachment[]>([]);
  newComment = '';

  showAddForm = false;
  newTitle = '';
  newDescription = '';
  newCategoryId = '';
  newSubCategoryId = '';
  newAssigneeId = '';
  newDueDate = '';

  readonly subCategoriesForNewCategory = computed(() =>
    this.subCategories().filter((s) => s.taskCategoryId === this.newCategoryId),
  );

  // ---------- List view state ----------
  readonly statusTab = signal<StatusTab>('all');
  readonly stateTabCounts = signal<TaskStateTabCount[]>([]);
  readonly listResult = signal<PagedResult<ProjectTask> | null>(null);
  readonly listPage = signal(1);

  filterCode = '';
  filterProjectId = '';
  filterDepartmentId = '';
  filterAssigneeId = '';
  filterCategoryId = '';
  filterSubCategoryId = '';
  filterTypeId = '';
  filterRoleId = '';
  filterPriorityId = '';
  filterFrequencyId = '';
  filterOverdue = false;
  filterCreatedFrom = '';
  filterCreatedTo = '';
  filterVerifiedFrom = '';
  filterVerifiedTo = '';

  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
    private readonly orgStructureService: OrgStructureService,
    protected readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((projects) => {
      this.projects.set(projects);
      if (projects.length > 0) {
        this.selectedProjectId.set(projects[0].id);
        this.loadTasks();
      }
    });
    this.tasksService.getTaskStates().subscribe((v) => this.states.set(v));
    this.tasksService.getTaskCategories().subscribe((v) => this.categories.set(v));
    this.tasksService.getTaskSubCategories().subscribe((v) => this.subCategories.set(v));
    this.tasksService.getTaskTypes().subscribe((v) => this.taskTypes.set(v));
    this.tasksService.getTaskRoles().subscribe((v) => this.taskRoles.set(v));
    this.tasksService.getPriorities().subscribe((v) => this.priorities.set(v));
    this.tasksService.getTaskFrequencies().subscribe((v) => this.frequencies.set(v));
    this.orgStructureService.getDepartments().subscribe((v) => this.departments.set(v));
    this.usersService.getUsers().subscribe((v) => this.users.set(v));
  }

  setView(view: View): void {
    this.view.set(view);
    if (view === 'list' && this.listResult() === null) {
      this.refreshList();
    }
  }

  // ---------- Board ----------

  onProjectChange(): void {
    this.expandedTaskId.set(null);
    this.loadTasks();
  }

  loadTasks(): void {
    if (!this.selectedProjectId()) return;
    this.tasksService.getTasks(this.selectedProjectId()).subscribe((v) => this.tasks.set(v));
  }

  tasksInState(stateId: string): ProjectTask[] {
    return this.tasks().filter((t) => t.taskStateId === stateId);
  }

  // ---------- List view ----------

  private buildFilters(): TaskSearchFilters {
    return {
      code: this.filterCode || undefined,
      projectId: this.filterProjectId || undefined,
      departmentId: this.filterDepartmentId || undefined,
      assigneeId: this.filterAssigneeId || undefined,
      taskCategoryId: this.filterCategoryId || undefined,
      taskSubCategoryId: this.filterSubCategoryId || undefined,
      taskTypeId: this.filterTypeId || undefined,
      taskRoleId: this.filterRoleId || undefined,
      priorityId: this.filterPriorityId || undefined,
      taskFrequencyId: this.filterFrequencyId || undefined,
      overdue: this.filterOverdue || undefined,
      createdFrom: this.filterCreatedFrom ? new Date(this.filterCreatedFrom).toISOString() : undefined,
      createdTo: this.filterCreatedTo ? new Date(this.filterCreatedTo).toISOString() : undefined,
      verifiedFrom: this.filterVerifiedFrom ? new Date(this.filterVerifiedFrom).toISOString() : undefined,
      verifiedTo: this.filterVerifiedTo ? new Date(this.filterVerifiedTo).toISOString() : undefined,
      taskStateId: this.isStateTab(this.statusTab()) ? this.statusTab() : undefined,
      onlyRemoved: this.statusTab() === 'removed' || undefined,
    };
  }

  private isStateTab(tab: StatusTab): tab is string {
    return tab !== 'all' && tab !== 'removed';
  }

  refreshList(): void {
    const filters = this.buildFilters();
    this.tasksService.searchTasks(filters, this.listPage(), PAGE_SIZE).subscribe({
      next: (result) => this.listResult.set(result),
      error: () => this.errorMessage.set('Could not load the task list.'),
    });

    // Counts should reflect every non-state filter but not the active tab itself, so switching
    // tabs doesn't make the other tabs' counts vanish.
    const countFilters = { ...filters, taskStateId: undefined, onlyRemoved: undefined };
    this.tasksService.getStateCounts(countFilters).subscribe((v) => this.stateTabCounts.set(v));
  }

  applyFilters(): void {
    this.listPage.set(1);
    this.refreshList();
  }

  clearFilters(): void {
    this.filterCode = '';
    this.filterProjectId = '';
    this.filterDepartmentId = '';
    this.filterAssigneeId = '';
    this.filterCategoryId = '';
    this.filterSubCategoryId = '';
    this.filterTypeId = '';
    this.filterRoleId = '';
    this.filterPriorityId = '';
    this.filterFrequencyId = '';
    this.filterOverdue = false;
    this.filterCreatedFrom = '';
    this.filterCreatedTo = '';
    this.filterVerifiedFrom = '';
    this.filterVerifiedTo = '';
    this.applyFilters();
  }

  selectStatusTab(tab: StatusTab): void {
    this.statusTab.set(tab);
    this.listPage.set(1);
    this.refreshList();
  }

  totalTaskCount(): number {
    return this.stateTabCounts().reduce((sum, s) => sum + s.count, 0);
  }

  goToListPage(page: number): void {
    const result = this.listResult();
    if (!result || page < 1 || page > result.totalPages) return;
    this.listPage.set(page);
    this.refreshList();
  }

  moveListTask(task: ProjectTask, newStateId: string): void {
    this.tasksService.changeState(task.id, newStateId).subscribe({
      next: () => this.refreshList(),
      error: () => this.errorMessage.set('Could not move task.'),
    });
  }

  // ---------- Shared: expand/discussion/history/attachments (used by both views) ----------

  moveTask(task: ProjectTask, newStateId: string): void {
    this.tasksService.changeState(task.id, newStateId).subscribe({
      next: (updated) => this.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t))),
      error: () => this.errorMessage.set('Could not move task.'),
    });
  }

  toggleExpand(task: ProjectTask): void {
    if (this.expandedTaskId() === task.id) {
      this.expandedTaskId.set(null);
      return;
    }
    this.expandedTaskId.set(task.id);
    this.tasksService.getDiscussions(task.id).subscribe((v) => this.discussions.set(v));
    this.tasksService.getStateHistory(task.id).subscribe((v) => this.stateHistory.set(v));
    this.tasksService.getAttachments(task.id).subscribe((v) => this.attachments.set(v));
  }

  onFileSelected(task: ProjectTask, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.tasksService.uploadAttachment(task.id, file).subscribe({
      next: (attachment) => this.attachments.update((list) => [attachment, ...list]),
      error: () => this.errorMessage.set('Could not upload file (max 25 MB).'),
    });
    input.value = '';
  }

  downloadAttachment(attachment: TaskAttachment): void {
    this.tasksService.downloadAttachment(attachment.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.fileName;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.errorMessage.set('Could not download file.'),
    });
  }

  removeAttachment(attachment: TaskAttachment): void {
    this.tasksService.deleteAttachment(attachment.id).subscribe(() =>
      this.attachments.update((list) => list.filter((a) => a.id !== attachment.id)),
    );
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  postComment(task: ProjectTask): void {
    if (!this.newComment.trim()) return;
    this.tasksService.addDiscussion(task.id, this.newComment).subscribe({
      next: (comment) => {
        this.discussions.update((list) => [...list, comment]);
        this.newComment = '';
      },
      error: () => this.errorMessage.set('Could not post comment.'),
    });
  }

  addTask(): void {
    if (!this.selectedProjectId() || !this.newTitle || !this.newCategoryId) {
      this.errorMessage.set('Title and category are required.');
      return;
    }
    this.tasksService
      .createTask({
        title: this.newTitle,
        description: this.newDescription,
        projectId: this.selectedProjectId(),
        taskCategoryId: this.newCategoryId,
        taskSubCategoryId: this.newSubCategoryId || null,
        assigneeId: this.newAssigneeId || null,
        dueDate: this.newDueDate ? new Date(this.newDueDate).toISOString() : null,
      })
      .subscribe({
        next: (task) => {
          this.tasks.update((list) => [...list, task]);
          this.newTitle = '';
          this.newDescription = '';
          this.newSubCategoryId = '';
          this.newAssigneeId = '';
          this.newDueDate = '';
          this.showAddForm = false;
          if (this.view() === 'list') this.refreshList();
        },
        error: () => this.errorMessage.set('Could not create task.'),
      });
  }

  removeTask(task: ProjectTask): void {
    this.tasksService.deleteTask(task.id).subscribe(() => {
      this.tasks.update((list) => list.filter((t) => t.id !== task.id));
      if (this.expandedTaskId() === task.id) this.expandedTaskId.set(null);
      if (this.view() === 'list') this.refreshList();
    });
  }

  stateKey(stateName: string): string {
    return stateName.toLowerCase().replace(/\s+/g, '');
  }
}
