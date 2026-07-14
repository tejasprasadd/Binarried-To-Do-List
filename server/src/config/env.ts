function readPort(value: string | undefined): number {
  if (value === undefined || value === '') {
    return 3000;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}

function readMongoUri(value: string | undefined): string {
  if (!value) {
    throw new Error('MONGODB_URI must be set. Copy server/.env.example to server/.env.');
  }

  return value;
}

export const env = Object.freeze({
  port: readPort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200',
  mongoUri: readMongoUri(process.env.MONGODB_URI),
});
