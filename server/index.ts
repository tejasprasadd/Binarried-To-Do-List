import { app } from './src/app';
import { env } from './src/config/env';

const server = app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

function shutdown(signal: NodeJS.Signals): void {
  console.log(`${signal} received; closing HTTP server.`);
  server.close((error) => {
    if (error) {
      console.error('Unable to close HTTP server cleanly.', error);
      process.exitCode = 1;
    }

    process.exit();
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
