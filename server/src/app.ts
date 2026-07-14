import express from 'express';

import { apiRouter } from './routes/api.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { corsMiddleware } from './middleware/cors.middleware';

export const app = express();

app.disable('x-powered-by');
app.use(corsMiddleware);
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
