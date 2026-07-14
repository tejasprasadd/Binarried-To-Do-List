export const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const DEMO_USER = Object.freeze({
  id: 'admin',
  username: 'admin',
});

export const DEMO_CREDENTIALS = Object.freeze({
  username: DEMO_USER.username,
  password: 'admin123',
});
