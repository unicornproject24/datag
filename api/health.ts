import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Test database connection
    const { default: prisma } = await import('../src/server/utils/prisma.js');
    await prisma.$queryRaw`SELECT 1`;

    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    }));
  } catch (error) {
    console.error('Health check failed:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
  }
}
