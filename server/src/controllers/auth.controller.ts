import type { RequestHandler } from 'express';

import { DEMO_CREDENTIALS, DEMO_USER } from '../constants/task.constants';
import { HttpError } from '../middleware/http-error';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export const login: RequestHandler = (request, response) => {
  const body = (request.body ?? {}) as LoginRequest;

  if (body.username !== DEMO_CREDENTIALS.username || body.password !== DEMO_CREDENTIALS.password) {
    throw new HttpError(401, 'Invalid username or password.');
  }

  const responseBody: LoginResponse = { isLoggedIn: true, username: DEMO_USER.username };
  response.status(200).json(responseBody);
};
