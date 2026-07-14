import { CanDeactivateFn } from '@angular/router';

import { TaskFormComponent } from './task-form.component';

export const unsavedTaskGuard: CanDeactivateFn<TaskFormComponent> = (component) => component.canDeactivate();
