import { TaskModel, type TaskDocument } from '../models/task.model';
import { HttpError } from '../middleware/http-error';
import type { TaskCreateInput, TaskListQuery, TaskResponse, TaskUpdateInput } from '../types/task.types';

function assertTaskId(id: string): void {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    throw new HttpError(404, 'Task not found.');
  }
}

function toTaskResponse(task: TaskDocument): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    dueDate: task.dueDate.toISOString().slice(0, 10),
    createdAt: task.createdAt.toISOString(),
  };
}

async function findOwnedTask(id: string, ownerId: string): Promise<TaskDocument> {
  assertTaskId(id);
  const task = await TaskModel.findOne({ _id: id, ownerId });
  if (!task) {
    throw new HttpError(404, 'Task not found.');
  }

  return task;
}

export async function listTasks(ownerId: string, query: TaskListQuery): Promise<TaskResponse[]> {
  const filter = query.status ? { ownerId, status: query.status } : { ownerId };
  const direction = query.direction === 'asc' ? 1 : -1;
  const tasks = await TaskModel.find(filter).sort({ [query.sort]: direction });

  return tasks.map(toTaskResponse);
}

export async function createTask(ownerId: string, input: TaskCreateInput): Promise<TaskResponse> {
  const task = await TaskModel.create({ ...input, ownerId });
  return toTaskResponse(task);
}

export async function getTask(ownerId: string, id: string): Promise<TaskResponse> {
  return toTaskResponse(await findOwnedTask(id, ownerId));
}

export async function updateTask(ownerId: string, id: string, input: TaskUpdateInput): Promise<TaskResponse> {
  const task = await findOwnedTask(id, ownerId);
  task.set(input);
  await task.save();

  return toTaskResponse(task);
}

export async function deleteTask(ownerId: string, id: string): Promise<void> {
  const task = await findOwnedTask(id, ownerId);
  await task.deleteOne();
}
