import { connectDatabase, disconnectDatabase } from '../../src/config/database';
import { env } from '../../src/config/env';

function deriveTestDatabaseUri(mongoUri: string): string {
  const url = new URL(mongoUri);
  const databaseName = url.pathname.slice(1) || 'binaried';
  url.pathname = `/${databaseName}_test`;
  return url.toString();
}

export async function connectTestDatabase(): Promise<void> {
  const uri = process.env.MONGODB_TEST_URI ?? deriveTestDatabaseUri(env.mongoUri);
  await connectDatabase(uri);
}

export { disconnectDatabase };
