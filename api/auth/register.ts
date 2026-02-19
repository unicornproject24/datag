import type { IncomingMessage, ServerResponse } from 'http';

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const body = await parseBody(req);
    const { email, password, name, researchInterests } = body;

    if (!email || !password || !name) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Email, password, and name are required' }));
    }

    const { AuthService } = await import('../../src/server/services/authService.js');
    const result = await AuthService.register({
      email,
      password,
      name,
      researchInterests
    });

    res.statusCode = 201;
    return res.end(JSON.stringify(result));
  } catch (error) {
    console.error('Registration error:', error);
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Registration failed' }));
  }
}
