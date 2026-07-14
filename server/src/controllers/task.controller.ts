import type { RequestHandler } from 'express';

import { HttpError } from '../middleware/http-error';
import * as taskService from '../services/task.service';
import { validateNewTask, validateTaskListQuery, validateTaskUpdate } from '../validators/task.validator';

function requireOwnerId(request: Parameters<RequestHandler>[0]): string {
  if (!request.demoUser) {
    throw new HttpError(500, 'Demo user context is unavailable.');
  }

  return request.demoUser.id;
}

function taskIdFromRequest(request: Parameters<RequestHandler>[0]): string {
  const { id } = request.params;
  if (typeof id !== 'string') {
    throw new HttpError(404, 'Task not found.');
  }

  return id;
}

export const listTasks: RequestHandler = async (request, response) => {
  const ownerId = requireOwnerId(request);
  const tasks = await taskService.listTasks(ownerId, validateTaskListQuery(request.query));

  response.status(200).json({ tasks });
};

export const createTask: RequestHandler = async (request, response) => {
  const ownerId = requireOwnerId(request);
  const task = await taskService.createTask(ownerId, validateNewTask(request.body));

  response.status(201).json({ task });
};

export const getTask: RequestHandler = async (request, response) => {
  const task = await taskService.getTask(requireOwnerId(request), taskIdFromRequest(request));
  response.status(200).json({ task });
};

export const updateTask: RequestHandler = async (request, response) => {
  const task = await taskService.updateTask(
    requireOwnerId(request),
    taskIdFromRequest(request),
    validateTaskUpdate(request.body),
  );

  response.status(200).json({ task });
};

export const deleteTask: RequestHandler = async (request, response) => {
  await taskService.deleteTask(requireOwnerId(request), taskIdFromRequest(request));

  response.sendStatus(204);
};
