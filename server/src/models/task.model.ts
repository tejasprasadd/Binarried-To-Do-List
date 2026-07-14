import { Schema, model, type HydratedDocument } from 'mongoose';

import { TASK_STATUSES, type TaskStatus } from '../constants/task.constants';

interface Task {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskDocument = HydratedDocument<Task>;

const taskSchema = new Schema<Task>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1_000 },
    status: { type: String, enum: TASK_STATUSES, default: 'todo', required: true },
    dueDate: { type: Date, required: true },
    ownerId: { type: String, required: true, immutable: true, index: true },
  },
  { timestamps: true },
);

taskSchema.index({ ownerId: 1, dueDate: 1 });

export const TaskModel = model<Task>('Task', taskSchema);
