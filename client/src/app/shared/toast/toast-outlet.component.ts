import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-outlet',
  template: `
    <section class="pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto grid max-w-md gap-3 sm:left-auto sm:right-5 sm:mx-0" aria-label="Application notifications">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface px-4 py-3 shadow-[0_18px_42px_rgba(32,35,63,0.18)]" [class.border-mint-strong]="toast.kind === 'success'" [class.border-red-300]="toast.kind === 'error'" [class.border-lilac-strong]="toast.kind === 'info'" [attr.role]="toast.kind === 'error' ? 'alert' : 'status'">
          <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-black" [class.bg-mint]="toast.kind === 'success'" [class.text-mint-strong]="toast.kind === 'success'" [class.bg-red-100]="toast.kind === 'error'" [class.text-red-700]="toast.kind === 'error'" [class.bg-lilac]="toast.kind === 'info'" [class.text-lilac-strong]="toast.kind === 'info'" aria-hidden="true">{{ toast.kind === 'success' ? '✓' : toast.kind === 'error' ? '!' : 'i' }}</span>
          <p class="min-w-0 flex-1 text-sm font-semibold leading-5 text-ink">{{ toast.message }}</p>
          <button type="button" (click)="toastService.dismiss(toast.id)" class="-mr-1 -mt-1 rounded-md px-2 py-1 text-sm font-bold text-muted hover:bg-canvas hover:text-ink" [attr.aria-label]="'Dismiss: ' + toast.message">×</button>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutletComponent {
  protected readonly toastService = inject(ToastService);
}
