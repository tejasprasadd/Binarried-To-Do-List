import type { RequestHandler } from 'express';

import { TaskModel, type TaskDocument } from '../models/task.model';
import { HttpError } from '../middleware/http-error';
import { validateNewTask, validateTaskListQuery, validateTaskUpdate } from '../validators/task.validator';

function requireOwnerId(request: Parameters<RequestHandler>[0]): string {
  if (!request.demoUser) {
    throw new HttpError(500, 'Demo user context is unavailable.');
  }

  return request.demoUser.id;
}

function assertTaskId(id: string): void {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    throw new HttpError(404, 'Task not found.');
  }
}

function taskIdFromRequest(request: Parameters<RequestHandler>[0]): string {
  const { id } = request.params;
  if (typeof id !== 'string') {
    throw new HttpError(404, 'Task not found.');
  }

  return id;
}

function serializeTask(task: TaskDocument) {
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

export const listTasks: RequestHandler = async (request, response) => {
  const ownerId = requireOwnerId(request);
  const { status, sort, direction } = validateTaskListQuery(request.query);
  const filter = status ? { ownerId, status } : { ownerId };
  const tasks = await TaskModel.find(filter).sort({ [sort]: direction === 'asc' ? 1 : -1 });

  response.status(200).json({ tasks: tasks.map(serializeTask) });
};

export const createTask: RequestHandler = async (request, response) => {
  const ownerId = requireOwnerId(request);
  const input = validateNewTask(request.body);
  const task = await TaskModel.create({ ...input, ownerId });

  response.status(201).json({ task: serializeTask(task) });
};

export const getTask: RequestHandler = async (request, response) => {
  const task = await findOwnedTask(taskIdFromRequest(request), requireOwnerId(request));
  response.status(200).json({ task: serializeTask(task) });
};

export const updateTask: RequestHandler = async (request, response) => {
  const task = await findOwnedTask(taskIdFromRequest(request), requireOwnerId(request));
  task.set(validateTaskUpdate(request.body));
  await task.save();

  response.status(200).json({ task: serializeTask(task) });
};

export const deleteTask: RequestHandler = async (request, response) => {
  const task = await findOwnedTask(taskIdFromRequest(request), requireOwnerId(request));
  await task.deleteOne();

  response.sendStatus(204);
};
