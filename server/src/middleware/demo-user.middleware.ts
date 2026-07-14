import type { RequestHandler } from 'express';

import { DEMO_USER } from '../constants/task.constants';

export const attachDemoUser: RequestHandler = (request, _response, next) => {
  request.demoUser = DEMO_USER;
  next();
};
