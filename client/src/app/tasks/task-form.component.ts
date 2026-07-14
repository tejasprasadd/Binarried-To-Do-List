import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TaskInput } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private taskId: string | null = null;

  protected readonly isEditing = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
    status: ['todo' as TaskInput['status'], [Validators.required]],
    dueDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.errorMessage.set(''));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId = id;
      this.isEditing.set(true);
      this.loadTask(id);
    }
  }

  canDeactivate(): boolean {
    if (!this.form.dirty || this.isSaving()) {
      return true;
    }

    return window.confirm('Discard your unsaved task changes?');
  }

  protected save(): void {
    if (this.form.invalid || this.isSaving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    const input = this.form.getRawValue();
    const request = this.taskId ? this.taskService.update(this.taskId, input) : this.taskService.create(input);

    request.subscribe({
      next: () => {
        this.form.markAsPristine();
        void this.router.navigate(['/tasks']);
      },
      error: (error: { error?: { message?: string; details?: Record<string, string> } }) => {
        const details = error.error?.details;
        if (details) {
          for (const [name, message] of Object.entries(details)) {
            const control = this.form.get(name);
            control?.setErrors({ ...control.errors, server: message });
          }
        }
        this.errorMessage.set(error.error?.message ?? 'The task could not be saved. Try again.');
        this.isSaving.set(false);
      },
    });
  }

  protected cancel(): void {
    if (this.canDeactivate()) {
      void this.router.navigate(['/tasks']);
    }
  }

  private loadTask(id: string): void {
    this.isLoading.set(true);
    this.taskService.get(id).subscribe({
      next: ({ task }) => {
        this.form.setValue({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        });
        this.form.markAsPristine();
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('This task could not be found.');
        this.isLoading.set(false);
      },
    });
  }
}
