import { Schema, model, type HydratedDocument } from 'mongoose';

import { TASK_STATUSES } from '../constants/task.constants';
import type { TaskRecord } from '../types/task.types';

export type TaskDocument = HydratedDocument<TaskRecord>;

const taskSchema = new Schema<TaskRecord>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1_000 },
    status: { type: String, enum: TASK_STATUSES, default: 'todo', required: true },
    dueDate: { type: Date, required: true },
    ownerId: { type: String, required: true, immutable: true, index: true },
  },
  { timestamps: true, versionKey: false },
);

taskSchema.index({ ownerId: 1, dueDate: 1 });

export const TaskModel = model<TaskRecord>('Task', taskSchema);
