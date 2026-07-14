import { TASK_STATUSES, type TaskStatus } from '../constants/task.constants';
import { HttpError } from '../middleware/http-error';

type TaskInput = {
  title?: string;
  description?: string | undefined;
  status?: TaskStatus;
  dueDate?: Date;
};

export type TaskListQuery = {
  status?: TaskStatus;
  sort: 'dueDate' | 'createdAt' | 'status';
  direction: 'asc' | 'desc';
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'Request body must be a JSON object.');
  }

  return value as Record<string, unknown>;
}

function parseDate(value: unknown, details: Record<string, string>): Date | undefined {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    details.dueDate = 'Due date must use the YYYY-MM-DD format.';
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month! - 1 ||
    date.getUTCDate() !== day
  ) {
    details.dueDate = 'Due date must be a valid calendar date.';
    return undefined;
  }

  return date;
}

function parseFields(body: Record<string, unknown>, partial: boolean): TaskInput {
  const details: Record<string, string> = {};
  const task: TaskInput = {};

  if ('title' in body || !partial) {
    if (typeof body.title !== 'string') {
      details.title = 'Title is required.';
    } else {
      const title = body.title.trim();
      if (title.length < 1 || title.length > 120) {
        details.title = 'Title must be between 1 and 120 characters.';
      } else {
        task.title = title;
      }
    }
  }

  if ('description' in body) {
    if (typeof body.description !== 'string') {
      details.description = 'Description must be a string.';
    } else {
      const description = body.description.trim();
      if (description.length > 1_000) {
        details.description = 'Description cannot exceed 1000 characters.';
      } else {
        task.description = description || undefined;
      }
    }
  }

  if ('status' in body) {
    if (typeof body.status !== 'string' || !TASK_STATUSES.includes(body.status as TaskStatus)) {
      details.status = 'Status must be todo, in-progress, or done.';
    } else {
      task.status = body.status as TaskStatus;
    }
  }

  if ('dueDate' in body || !partial) {
    const date = parseDate(body.dueDate, details);
    if (date) {
      task.dueDate = date;
    }
  }

  if (Object.keys(details).length > 0) {
    throw new HttpError(422, 'Task input is invalid.', details);
  }

  if (partial && Object.keys(task).length === 0) {
    throw new HttpError(422, 'Provide at least one task field to update.');
  }

  return task;
}

export function validateNewTask(value: unknown): Required<Pick<TaskInput, 'title' | 'status' | 'dueDate'>> & TaskInput {
  const body = asRecord(value);
  const task = parseFields(body, false);
  return { ...task, status: task.status ?? 'todo' } as Required<Pick<TaskInput, 'title' | 'status' | 'dueDate'>> & TaskInput;
}

export function validateTaskUpdate(value: unknown): TaskInput {
  return parseFields(asRecord(value), true);
}

export function validateTaskListQuery(value: Record<string, unknown>): TaskListQuery {
  const statusValue = value.status;
  const sortValue = value.sort;
  const directionValue = value.direction;

  if (statusValue !== undefined && statusValue !== 'all' && !TASK_STATUSES.includes(statusValue as TaskStatus)) {
    throw new HttpError(400, 'Status filter is invalid.');
  }
  if (sortValue !== undefined && !['dueDate', 'createdAt', 'status'].includes(sortValue as string)) {
    throw new HttpError(400, 'Sort field is invalid.');
  }
  if (directionValue !== undefined && directionValue !== 'asc' && directionValue !== 'desc') {
    throw new HttpError(400, 'Sort direction is invalid.');
  }

  return {
    status: statusValue === 'all' || statusValue === undefined ? undefined : statusValue as TaskStatus,
    sort: (sortValue as TaskListQuery['sort'] | undefined) ?? 'dueDate',
    direction: (directionValue as TaskListQuery['direction'] | undefined) ?? 'asc',
  };
}
