import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import request from 'supertest';

import { app } from '../src/app';
import { TaskModel } from '../src/models/task.model';
import { connectTestDatabase, disconnectDatabase } from './support/database';

const api = request(app);

async function createTask(input: Partial<Record<'title' | 'description' | 'status' | 'dueDate', string>> = {}) {
  return api.post('/api/tasks').send({
    title: input.title ?? 'Write integration tests',
    description: input.description ?? 'Exercise the task API.',
    status: input.status ?? 'todo',
    dueDate: input.dueDate ?? '2026-08-01',
  });
}

beforeAll(async () => {
  await connectTestDatabase();
});

beforeEach(async () => {
  await TaskModel.deleteMany({});
});

afterAll(async () => {
  await disconnectDatabase();
});

describe('POST /api/login', () => {
  test('accepts the demo credentials', async () => {
    const response = await api.post('/api/login').send({ username: 'admin', password: 'admin123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isLoggedIn: true, username: 'admin' });
  });

  test('rejects invalid credentials', async () => {
    const response = await api.post('/api/login').send({ username: 'admin', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid username or password.');
  });
});

describe('task API', () => {
  test('creates, reads, updates, and deletes an owned task', async () => {
    const created = await createTask({ title: 'Plan launch', dueDate: '2026-08-15' });
    expect(created.status).toBe(201);
    expect(created.body.task).toMatchObject({
      title: 'Plan launch',
      status: 'todo',
      dueDate: '2026-08-15',
    });

    const id = created.body.task.id as string;
    const fetched = await api.get(`/api/tasks/${id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.task.id).toBe(id);

    const updated = await api.patch(`/api/tasks/${id}`).send({ status: 'done', description: '' });
    expect(updated.status).toBe(200);
    expect(updated.body.task).toMatchObject({ status: 'done', description: '' });

    const deleted = await api.delete(`/api/tasks/${id}`);
    expect(deleted.status).toBe(204);

    const missing = await api.get(`/api/tasks/${id}`);
    expect(missing.status).toBe(404);
  });

  test('returns validation details for invalid task input', async () => {
    const response = await api.post('/api/tasks').send({ title: ' ', dueDate: '2026-02-30', status: 'later' });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ message: 'Task input is invalid.' });
    expect(response.body.details).toMatchObject({
      title: expect.any(String),
      dueDate: expect.any(String),
      status: expect.any(String),
    });
  });

  test('does not expose tasks belonging to another owner', async () => {
    const otherUsersTask = await TaskModel.create({
      title: 'Private task',
      status: 'todo',
      dueDate: new Date('2026-08-02T00:00:00.000Z'),
      ownerId: 'another-user',
    });

    const list = await api.get('/api/tasks');
    expect(list.status).toBe(200);
    expect(list.body.tasks).toEqual([]);

    const fetched = await api.get(`/api/tasks/${otherUsersTask.id}`);
    expect(fetched.status).toBe(404);
  });

  test('filters and sorts tasks from query parameters', async () => {
    await createTask({ title: 'Later todo', dueDate: '2026-08-20', status: 'todo' });
    await createTask({ title: 'Earlier done', dueDate: '2026-08-02', status: 'done' });
    await createTask({ title: 'Earlier todo', dueDate: '2026-08-01', status: 'todo' });

    const filtered = await api.get('/api/tasks').query({ status: 'todo', sort: 'dueDate', direction: 'asc' });
    expect(filtered.status).toBe(200);
    expect(filtered.body.tasks.map((task: { title: string }) => task.title)).toEqual(['Earlier todo', 'Later todo']);

    const statusSorted = await api.get('/api/tasks').query({ sort: 'status', direction: 'desc' });
    expect(statusSorted.status).toBe(200);
    expect(statusSorted.body.tasks.map((task: { status: string }) => task.status)).toEqual(['todo', 'todo', 'done']);
  });

  test('handles missing resources and invalid queries', async () => {
    const missing = await api.get('/api/tasks/507f1f77bcf86cd799439011');
    expect(missing.status).toBe(404);

    const invalidQuery = await api.get('/api/tasks').query({ status: 'blocked' });
    expect(invalidQuery.status).toBe(400);
    expect(invalidQuery.body.message).toBe('Status filter is invalid.');
  });
});
