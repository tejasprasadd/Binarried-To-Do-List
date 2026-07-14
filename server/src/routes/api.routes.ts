import { Router } from 'express';

import { getHealth } from '../controllers/health.controller';
import { authRouter } from './auth.routes';
import { taskRouter } from './task.routes';

export const apiRouter = Router();

apiRouter.get('/health', getHealth);
apiRouter.use(authRouter);
apiRouter.use('/tasks', taskRouter);
