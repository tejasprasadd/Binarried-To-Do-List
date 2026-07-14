import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../auth/auth.service';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';
import { Task, TaskListQuery, TaskStatus } from './task.model';
import { TaskService } from './task.service';

const DEFAULT_QUERY: TaskListQuery = { status: 'all', sort: 'dueDate', direction: 'asc' };

@Component({
  selector: 'app-tasks-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './tasks-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDashboardComponent {
  private readonly taskService = inject(TaskService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly query = signal<TaskListQuery>(DEFAULT_QUERY);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly isDeleting = signal<string | null>(null);

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const status = params.get('status');
      const sort = params.get('sort');
      const query: TaskListQuery = {
        status: this.isStatus(status) ? status : DEFAULT_QUERY.status,
        sort: this.isSort(sort) ? sort : DEFAULT_QUERY.sort,
        direction: params.get('direction') === 'desc' ? 'desc' : 'asc',
      };
      this.query.set(query);
      this.loadTasks(query);
    });
  }

  protected updateQuery(change: Partial<TaskListQuery>): void {
    const nextQuery = { ...this.query(), ...change };
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: nextQuery,
    });
  }

  protected retry(): void {
    this.loadTasks(this.query());
  }

  protected deleteTask(task: Task): void {
    const dialogRef = this.dialog.open<boolean>(ConfirmDeleteDialogComponent, {
      data: { title: task.title },
      ariaLabel: `Delete ${task.title}`,
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.isDeleting.set(task.id);
      this.taskService.delete(task.id).subscribe({
        next: () => {
          this.tasks.update((tasks) => tasks.filter((item) => item.id !== task.id));
          this.isDeleting.set(null);
        },
        error: () => {
          this.errorMessage.set('The task could not be deleted. Try again.');
          this.isDeleting.set(null);
        },
      });
    });
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  protected statusLabel(status: TaskStatus): string {
    return status === 'in-progress' ? 'In progress' : status[0].toUpperCase() + status.slice(1);
  }

  protected isOverdue(task: Task): boolean {
    return task.status !== 'done' && task.dueDate < new Date().toISOString().slice(0, 10);
  }

  private loadTasks(query: TaskListQuery): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.taskService.list(query).subscribe({
      next: ({ tasks }) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Your tasks could not be loaded. Check that the API is running, then try again.');
        this.isLoading.set(false);
      },
    });
  }

  private isStatus(value: string | null): value is TaskListQuery['status'] {
    return value === 'all' || value === 'todo' || value === 'in-progress' || value === 'done';
  }

  private isSort(value: string | null): value is TaskListQuery['sort'] {
    return value === 'dueDate' || value === 'createdAt' || value === 'status';
  }
}
