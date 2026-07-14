import type { RequestHandler } from 'express';

import { env } from '../config/env';

export const corsMiddleware: RequestHandler = (request, response, next) => {
  const origin = request.header('origin');

  if (origin === env.clientOrigin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
};
