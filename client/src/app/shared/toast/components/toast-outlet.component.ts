import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-outlet',
  templateUrl: './toast-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutletComponent {
  protected readonly toastService = inject(ToastService);
}
