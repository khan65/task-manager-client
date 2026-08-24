import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/projects.models';
import { UsersService } from '../users/users.service';
import { UserSummary } from '../users/users.models';
import { TasksService } from './tasks.service';
import { ProjectTask, TaskCategory, TaskDiscussion, TaskState, TaskStateHistoryEntry, TaskSubCategory } from './tasks.models';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  readonly projects = signal<Project[]>([]);
  readonly selectedProjectId = signal<string>('');

  readonly states = signal<TaskState[]>([]);
  readonly tasks = signal<ProjectTask[]>([]);
  readonly categories = signal<TaskCategory[]>([]);
  readonly subCategories = signal<TaskSubCategory[]>([]);
  readonly users = signal<UserSummary[]>([]);
  readonly errorMessage = signal<string | null>(null);

  readonly expandedTaskId = signal<string | null>(null);
  readonly discussions = signal<TaskDiscussion[]>([]);
  readonly stateHistory = signal<TaskStateHistoryEntry[]>([]);
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

  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
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
    this.usersService.getUsers().subscribe((v) => this.users.set(v));
  }

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
        },
        error: () => this.errorMessage.set('Could not create task.'),
      });
  }

  removeTask(task: ProjectTask): void {
    this.tasksService.deleteTask(task.id).subscribe(() => {
      this.tasks.update((list) => list.filter((t) => t.id !== task.id));
      if (this.expandedTaskId() === task.id) this.expandedTaskId.set(null);
    });
  }
}
