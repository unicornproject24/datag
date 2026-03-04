# Backend Deployment Guide

## Deploy to Railway.app

### Step 1: Prepare Your Backend
1. Create a new file `railway.json` in your project root:

```json
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

### Step 2: Set Environment Variables
In Railway dashboard, add these environment variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `PORT` - Railway will auto-set this (usually 8080)
- `JWT_SECRET` - Your JWT secret key

### Step 3: Deploy
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect and deploy

### Step 4: Update Frontend API Calls
Once deployed, Railway will give you a URL like: `https://your-app.railway.app`

Update your `.env.production` or create environment-specific config:

```bash
VITE_API_BASE_URL=https://your-app.railway.app/api
```

Then update all fetch calls in your components to use:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
```

---

## Deploy to Render.com

### Step 1: Create Web Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo

### Step 2: Configure
- **Name**: datag-backend
- **Environment**: Node
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npx tsx src/server/index.ts`

### Step 3: Add Environment Variables
- `DATABASE_URL`
- `PORT` (Render sets this automatically)
- `JWT_SECRET`

---

## Alternative: Use Serverless Functions (Vercel)

Since you're already using Vercel, you can convert your Express routes to Vercel serverless functions:

### Step 1: Move API Routes
Move all files from `src/server/routes/` to `api/` folder at root

### Step 2: Update for Serverless
Each route file should export a handler function instead of Express router.

Example - `api/page-contents.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  // Your existing logic here
}
```

### Step 3: Create vercel.json
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

### Step 4: Update Frontend
Change API calls to use relative paths:
```typescript
const API_BASE = '/api';
```

This approach keeps everything on Vercel but requires refactoring your Express server.
