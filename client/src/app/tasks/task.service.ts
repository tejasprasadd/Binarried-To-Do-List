import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../core/api/api.config';
import { Task, TaskInput, TaskListQuery } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(query: TaskListQuery): Observable<{ tasks: Task[] }> {
    const params = new HttpParams({
      fromObject: {
        status: query.status,
        sort: query.sort,
        direction: query.direction,
      },
    });
    return this.http.get<{ tasks: Task[] }>(`${this.apiBaseUrl}/tasks`, { params });
  }

  get(id: string): Observable<{ task: Task }> {
    return this.http.get<{ task: Task }>(`${this.apiBaseUrl}/tasks/${id}`);
  }

  create(input: TaskInput): Observable<{ task: Task }> {
    return this.http.post<{ task: Task }>(`${this.apiBaseUrl}/tasks`, input);
  }

  update(id: string, input: TaskInput): Observable<{ task: Task }> {
    return this.http.patch<{ task: Task }>(`${this.apiBaseUrl}/tasks/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/tasks/${id}`);
  }
}
