import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api/api.config';
import type { TaskInput, TaskListQuery, TaskListResponse, TaskResponse } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: TaskListQuery): Observable<TaskListResponse> {
    const params = new HttpParams({
      fromObject: {
        status: query.status,
        sort: query.sort,
        direction: query.direction,
      },
    });
    return this.http.get<TaskListResponse>(`${this.apiBaseUrl}/tasks`, { params });
  }

  get(id: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.apiBaseUrl}/tasks/${id}`);
  }

  create(input: TaskInput): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiBaseUrl}/tasks`, input);
  }

  update(id: string, input: TaskInput): Observable<TaskResponse> {
    return this.http.patch<TaskResponse>(`${this.apiBaseUrl}/tasks/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/tasks/${id}`);
  }
}
