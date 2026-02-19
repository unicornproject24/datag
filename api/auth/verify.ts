import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'Authentication required' }));
    }

    const token = authHeader.split(' ')[1];
    const { AuthService } = await import('../../src/server/services/authService.js');
    const user = await AuthService.verifyToken(token);
    
    res.statusCode = 200;
    return res.end(JSON.stringify({ user }));
  } catch (error) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: 'Invalid or expired token' }));
  }
}
