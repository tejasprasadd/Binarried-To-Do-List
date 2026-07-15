import { CanDeactivateFn } from '@angular/router';

import { TaskFormComponent } from '../components/task-form.component';

export const unsavedTaskGuard: CanDeactivateFn<TaskFormComponent> = (component) => component.canDeactivate();
