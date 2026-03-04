# Vercel Deployment Fix - Step by Step

## Problem
Your frontend is deployed on Vercel at https://datag-five.vercel.app/, but your backend Express server is not accessible. Vercel only hosts static files and serverless functions - it doesn't run persistent Node.js servers.

## Solution Options

### Option A: Quick Test (Use Local Backend with Tunnel)

For testing purposes, you can use ngrok to expose your local backend:

```bash
# Install ngrok
npm install -g ngrok

# Start your backend locally
npx tsx src/server/index.ts

# In another terminal, expose it
ngrok http 3001

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Temporarily update your frontend code to use this URL
```

**Not recommended for production** - only for testing.

---

### Option B: Deploy Backend to Railway (Recommended)

#### 1. Create Railway Account
Go to https://railway.app and sign up with GitHub.

#### 2. Deploy Backend
```bash
# In your project root, create railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx tsx src/server/index.ts",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 3. Add Environment Variables in Railway
- `DATABASE_URL`: Your PostgreSQL connection string
- `PORT`: Railway auto-assigns (usually 8080)
- `JWT_SECRET`: Your secret key

#### 4. Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

Railway will give you a URL like: `https://your-app.up.railway.app`

#### 5. Update Frontend Code
Create `.env.production`:
```bash
VITE_API_BASE_URL=https://your-app.up.railway.app
```

Update all API calls in components. For example, in `src/pages/HomePage.tsx`:

```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Change from:
const res = await fetch('/api/page-contents?pageKey=homepage');

// To:
const res = await fetch(`${API_BASE}/page-contents?pageKey=homepage`);
```

Do the same for:
- `src/pages/AboutPage.tsx`
- `src/pages/AdminPage.tsx`
- All other components making API calls

#### 6. Redeploy to Vercel
```bash
git add .
git commit -m "Update API calls for production"
git push
vercel --prod
```

---

### Option C: Convert to Vercel Serverless Functions (Advanced)

Since you're already using Vercel, convert your Express routes to Vercel serverless functions.

#### 1. Move Route Files
Move all files from `src/server/routes/` to `api/`:
```bash
mv src/server/routes/*.ts api/
```

#### 2. Update Each File
Change from Express Router to Vercel handler format.

**Before (Express):**
```typescript
import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/', async (req, res) => {
  // logic
});

export default router;
```

**After (Vercel):**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  try {
    // Same logic here
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
```

#### 3. Handle CORS
Create `api/_middleware.ts` (already created for you).

#### 4. Update vercel.json
Make sure your vercel.json has:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

#### 5. Keep Using Relative Paths
Your frontend already uses `/api/...` which is perfect!

#### 6. Deploy
```bash
vercel --prod
```

---

## Recommended Approach

**Option B (Railway)** is recommended because:
- ✅ Minimal code changes
- ✅ Your Express server works as-is
- ✅ Easy to set up and manage
- ✅ Free tier available ($5/month for always-on)
- ✅ Persistent database connections

**Option C (Serverless)** requires refactoring all your Express routes but keeps everything on Vercel.

---

## Quick Fix Steps (Using Railway)

1. **Deploy backend to Railway** (15 minutes)
2. **Get Railway URL**
3. **Add `.env.production`** with `VITE_API_BASE_URL`
4. **Update 5-6 files** to use `API_BASE` variable
5. **Push to Git** and redeploy to Vercel

Your site will then work perfectly at https://datag-five.vercel.app/
