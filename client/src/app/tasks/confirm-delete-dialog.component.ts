import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';

type DeleteDialogData = { title: string };

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [DialogModule],
  template: `
    <section class="w-[min(25rem,calc(100vw-2rem))] rounded-[1.5rem] bg-surface p-6 shadow-2xl" aria-labelledby="delete-dialog-title">
      <p class="font-mono text-xs uppercase tracking-[0.16em] text-red-700">Permanent action</p>
      <h2 id="delete-dialog-title" class="mt-3 text-2xl font-black tracking-[-0.04em] text-ink">Delete “{{ data.title }}”?</h2>
      <p class="mt-3 leading-6 text-muted">This removes the task from your list. This action cannot be undone.</p>
      <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" (click)="dialogRef.close(false)" class="rounded-xl border border-line px-4 py-2.5 font-bold text-ink hover:bg-lilac">Keep task</button>
        <button type="button" (click)="dialogRef.close(true)" cdkFocusInitial class="rounded-xl bg-red-700 px-4 py-2.5 font-bold text-white hover:bg-red-800">Delete task</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialogComponent {
  readonly dialogRef = inject(DialogRef<boolean>);
  readonly data = inject<DeleteDialogData>(DIALOG_DATA);
}
