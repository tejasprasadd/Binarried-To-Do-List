import mongoose from 'mongoose';

import { env } from './env';

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB.');
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
