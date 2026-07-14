import type { DEMO_USER } from '../constants/task.constants';

declare global {
  namespace Express {
    interface Request {
      demoUser?: typeof DEMO_USER;
    }
  }
}

export {};
