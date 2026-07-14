import { Router } from 'express';

import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/task.controller';
import { attachDemoUser } from '../middleware/demo-user.middleware';

export const taskRouter = Router();

taskRouter.use(attachDemoUser);
taskRouter.route('/').get(listTasks).post(createTask);
taskRouter.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
