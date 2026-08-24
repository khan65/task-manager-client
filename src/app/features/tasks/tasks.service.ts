import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProjectTask,
  TaskAttachment,
  TaskCategory,
  TaskDiscussion,
  TaskState,
  TaskStateHistoryEntry,
  TaskSubCategory,
} from './tasks.models';

const base = environment.apiBaseUrl;

export interface UpsertTaskPayload {
  title: string;
  description: string;
  projectId: string;
  taskCategoryId: string;
  taskSubCategoryId: string | null;
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
