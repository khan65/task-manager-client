import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiAnswer } from './ai.models';

const base = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  constructor(private readonly http: HttpClient) {}

  ask(question: string): Observable<AiAnswer> {
    return this.http.post<AiAnswer>(`${base}/ai/ask`, { question });
  }
}
