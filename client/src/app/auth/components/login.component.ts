import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { readApiError } from '../../core/api/api-error.model';
import { ToastService } from '../../shared/toast/services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['admin', [Validators.required]],
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    const { username, password } = this.form.getRawValue();

    this.auth.login({ username, password }).subscribe({
      next: () => {
        this.toast.success('Signed in as admin.');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/tasks');
      },
      error: (error: unknown) => {
        const message = readApiError(error).message ?? 'Sign in could not be completed. Try again.';
        this.errorMessage.set(message);
        this.toast.error(message);
        this.isSubmitting.set(false);
      },
    });
  }
}
