import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
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

const base = environment.apiBaseUrl;

export interface UpsertTaskPayload {
  title: string;
  description: string;
  projectId: string;
  taskCategoryId: string;
  taskSubCategoryId: string | null;
  taskTypeId?: string | null;
  taskRoleId?: string | null;
  priorityId?: string | null;
  taskFrequencyId?: string | null;
  assigneeId: string | null;
  dueDate: string | null;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private readonly http: HttpClient) {}

  getTaskCategories(): Observable<TaskCategory[]> {
    return this.http.get<TaskCategory[]>(`${base}/task-categories`);
  }
  createTaskCategory(name: string, description: string): Observable<TaskCategory> {
    return this.http.post<TaskCategory>(`${base}/task-categories`, { name, description });
  }

  getTaskSubCategories(): Observable<TaskSubCategory[]> {
    return this.http.get<TaskSubCategory[]>(`${base}/task-subcategories`);
  }
  createTaskSubCategory(name: string, description: string, taskCategoryId: string): Observable<TaskSubCategory> {
    return this.http.post<TaskSubCategory>(`${base}/task-subcategories`, { name, description, taskCategoryId });
  }

  getTaskStates(): Observable<TaskState[]> {
    return this.http.get<TaskState[]>(`${base}/task-states`);
  }

  getTaskTypes(): Observable<TaskType[]> {
    return this.http.get<TaskType[]>(`${base}/task-types`);
  }
  createTaskType(name: string, description: string): Observable<TaskType> {
    return this.http.post<TaskType>(`${base}/task-types`, { name, description });
  }

  getTaskRoles(): Observable<TaskRole[]> {
    return this.http.get<TaskRole[]>(`${base}/task-roles`);
  }
  createTaskRole(name: string, description: string): Observable<TaskRole> {
    return this.http.post<TaskRole>(`${base}/task-roles`, { name, description });
  }

  getPriorities(): Observable<Priority[]> {
    return this.http.get<Priority[]>(`${base}/priorities`);
  }
  createPriority(name: string, sortOrder: number): Observable<Priority> {
    return this.http.post<Priority>(`${base}/priorities`, { name, sortOrder });
  }

  getTaskFrequencies(): Observable<TaskFrequency[]> {
    return this.http.get<TaskFrequency[]>(`${base}/task-frequencies`);
  }
  createTaskFrequency(name: string): Observable<TaskFrequency> {
    return this.http.post<TaskFrequency>(`${base}/task-frequencies`, { name });
  }

  getTasks(projectId: string): Observable<ProjectTask[]> {
    return this.http.get<ProjectTask[]>(`${base}/tasks`, { params: { projectId } });
  }
  createTask(payload: UpsertTaskPayload): Observable<ProjectTask> {
    return this.http.post<ProjectTask>(`${base}/tasks`, payload);
  }
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${base}/tasks/${id}`);
  }
  changeState(taskId: string, taskStateId: string): Observable<ProjectTask> {
    return this.http.put<ProjectTask>(`${base}/tasks/${taskId}/state`, { taskStateId });
  }

  /** The cross-project, filterable, paginated list view. */
  searchTasks(filters: TaskSearchFilters, page: number, pageSize: number): Observable<PagedResult<ProjectTask>> {
    return this.http.get<PagedResult<ProjectTask>>(`${base}/tasks/search`, {
      params: this.toHttpParams(filters, page, pageSize),
    });
  }

  getStateCounts(filters: TaskSearchFilters): Observable<TaskStateTabCount[]> {
    return this.http.get<TaskStateTabCount[]>(`${base}/tasks/counts-by-state`, {
      params: this.toHttpParams(filters),
    });
  }

  private toHttpParams(filters: TaskSearchFilters, page?: number, pageSize?: number): Record<string, string> {
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') params[key] = String(value);
    }
    if (page !== undefined) params['page'] = String(page);
    if (pageSize !== undefined) params['pageSize'] = String(pageSize);
    return params;
  }

  getStateHistory(taskId: string): Observable<TaskStateHistoryEntry[]> {
    return this.http.get<TaskStateHistoryEntry[]>(`${base}/tasks/${taskId}/state-history`);
  }

  getDiscussions(taskId: string): Observable<TaskDiscussion[]> {
    return this.http.get<TaskDiscussion[]>(`${base}/tasks/${taskId}/discussions`);
  }
  addDiscussion(taskId: string, message: string): Observable<TaskDiscussion> {
    return this.http.post<TaskDiscussion>(`${base}/tasks/${taskId}/discussions`, { message });
  }

  getAttachments(taskId: string): Observable<TaskAttachment[]> {
    return this.http.get<TaskAttachment[]>(`${base}/tasks/${taskId}/attachments`);
  }
  uploadAttachment(taskId: string, file: File): Observable<TaskAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TaskAttachment>(`${base}/tasks/${taskId}/attachments`, formData);
  }
  downloadAttachment(attachmentId: string): Observable<Blob> {
    return this.http.get(`${base}/tasks/attachments/${attachmentId}/download`, { responseType: 'blob' });
  }
  deleteAttachment(attachmentId: string): Observable<void> {
    return this.http.delete<void>(`${base}/tasks/attachments/${attachmentId}`);
  }
}
