import { app } from './src/app';
import { connectDatabase, disconnectDatabase } from './src/config/database';
import { env } from './src/config/env';

async function start(): Promise<void> {
  await connectDatabase();
  const server = app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    console.log(`${signal} received; closing HTTP server.`);
    server.close(async (error) => {
      if (error) {
        console.error('Unable to close HTTP server cleanly.', error);
        process.exitCode = 1;
      }

      await disconnectDatabase();
      process.exit();
    });
  }

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

start().catch((error: unknown) => {
  console.error('Unable to start API.', error);
  process.exit(1);
});
