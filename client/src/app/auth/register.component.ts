import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  template: `
    <main class="grid min-h-dvh place-items-center bg-canvas p-5">
      <section class="w-full max-w-lg rounded-[2rem] bg-surface p-8 shadow-[0_20px_60px_rgba(32,35,63,0.10)] sm:p-10">
        <p class="font-mono text-xs uppercase tracking-[0.16em] text-muted">Demo limitation</p>
        <h1 class="mt-3 text-4xl font-black tracking-[-0.05em] text-ink">Registration is not part of this demo.</h1>
        <p class="mt-5 leading-7 text-muted">Binaried currently has one shared account so you can explore the task workflow without creating credentials.</p>
        <div class="mt-7 rounded-xl bg-mint/45 p-4 font-mono text-sm text-ink">admin / admin123</div>
        <a routerLink="/login" class="mt-8 inline-flex rounded-xl bg-ink px-5 py-3 font-bold text-white transition hover:bg-lilac-strong">Back to sign in</a>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {}
