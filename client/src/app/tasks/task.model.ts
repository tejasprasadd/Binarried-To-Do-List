export const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
};

export type TaskInput = Pick<Task, 'title' | 'description' | 'status' | 'dueDate'>;

export type TaskListQuery = {
  status: 'all' | TaskStatus;
  sort: 'dueDate' | 'createdAt' | 'status';
  direction: 'asc' | 'desc';
};

export interface TaskResponse {
  task: Task;
}

export interface TaskListResponse {
  tasks: Task[];
}
