import type { TaskStatus } from '../constants/task.constants';

export interface TaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: Date;
}

export interface TaskRecord extends TaskData {
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCreateInput = TaskData;
export type TaskUpdateInput = Partial<TaskData>;

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface TaskListQuery {
  status?: TaskStatus;
  sort: 'dueDate' | 'createdAt' | 'status';
  direction: 'asc' | 'desc';
}
