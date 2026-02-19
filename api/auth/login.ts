import type { IncomingMessage, ServerResponse } from 'http';

// Helper to parse JSON body
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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
    const { email, password } = body;

    if (!email || !password) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Email and password are required' }));
    }

    const { AuthService } = await import('../../src/server/services/authService.js');
    const result = await AuthService.login(email, password);
    
    res.statusCode = 200;
    return res.end(JSON.stringify(result));
  } catch (error) {
    console.error('Login error:', error);
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Invalid credentials' }));
  }
}
