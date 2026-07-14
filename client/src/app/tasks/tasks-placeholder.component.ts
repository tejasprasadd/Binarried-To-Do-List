import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tasks-placeholder',
  template: `
    <main class="grid min-h-dvh place-items-center bg-canvas p-5">
      <section class="w-full max-w-xl rounded-[2rem] bg-surface p-8 shadow-[0_20px_60px_rgba(32,35,63,0.10)] sm:p-10">
        <p class="font-mono text-xs uppercase tracking-[0.16em] text-muted">Signed in as admin</p>
        <h1 class="mt-3 text-4xl font-black tracking-[-0.05em] text-ink">Your task list is next.</h1>
        <p class="mt-4 text-muted">Authentication is working. The full task dashboard arrives in the next phase.</p>
        <button type="button" (click)="logout()" class="mt-8 rounded-xl border border-line px-5 py-3 font-bold text-ink transition hover:bg-lilac">Sign out</button>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPlaceholderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
