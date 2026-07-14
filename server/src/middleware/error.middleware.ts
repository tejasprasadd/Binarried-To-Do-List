import type { ErrorRequestHandler, RequestHandler } from 'express';

import { HttpError } from './http-error';

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'Route not found.' });
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ message: 'Request body must be valid JSON.' });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'An unexpected error occurred.' });
};
