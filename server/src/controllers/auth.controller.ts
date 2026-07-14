import type { RequestHandler } from 'express';

import { HttpError } from '../middleware/http-error';

export const login: RequestHandler = (request, response) => {
  const { username, password } = request.body as Record<string, unknown>;

  if (username !== 'admin' || password !== 'admin123') {
    throw new HttpError(401, 'Invalid username or password.');
  }

  response.status(200).json({ isLoggedIn: true, username: 'admin' });
};
