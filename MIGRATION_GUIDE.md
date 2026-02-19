# Migration Guide: Supabase to Prisma Implementation

## Overview

This guide provides step-by-step instructions for migrating the Data Well-being Group Webpage from Supabase key-value storage to Prisma with PostgreSQL.

## Prerequisites

1. Node.js 18+ installed
2. PostgreSQL database access (using provided connection string)
3. npm or yarn package manager

## Phase 1: Project Setup

### 1.1 Install Prisma Dependencies

```bash
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs multer nodemailer
npm install @types/jsonwebtoken @types/bcryptjs @types/multer @types/nodemailer
```

### 1.2 Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` (already created)
- `.env` file (configure with your database URL)

### 1.3 Configure Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update the `.env` file with your actual values, especially:
- `JWT_SECRET` - Generate a strong secret
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` - For initial admin user
- Email configuration for notifications

## Phase 2: Database Migration

### 2.1 Create Initial Migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database tables
- Generate Prisma Client
- Create migration files

### 2.2 Seed Initial Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@datawellbeing.org',
      password: adminPassword,
      name: process.env.DEFAULT_ADMIN_NAME || 'System Administrator',
      role: 'ADMIN',
      status: 'APPROVED',
      emailVerified: true,
      isPublic: false
    }
  });

  console.log('Admin user created:', admin.email);

  // Create initial settings
  await prisma.setting.createMany({
    data: [
      { key: 'site_name', value: 'Data Well-being Group', description: 'Website name' },
      { key: 'site_description', value: 'Advancing research at the intersection of data science and human well-being', description: 'Site description' },
      { key: 'contact_email', value: 'info@datawellbeing.org', description: 'Main contact email' },
      { key: 'maintenance_mode', value: 'false', description: 'Maintenance mode status' }
    ]
  });

  console.log('Initial settings created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json` to include seed script:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Run the seed:

```bash
npx prisma db seed
```

## Phase 3: Backend API Implementation

### 3.1 Create API Server Structure

Create `src/server/` directory with the following files:

```
src/server/
├── index.ts          # Main server file
├── middleware/
│   ├── auth.ts       # Authentication middleware
│   └── validation.ts # Input validation
├── routes/
│   ├── auth.ts       # Authentication routes
│   ├── users.ts      # User management
│   ├── papers.ts     # Research papers
│   ├── posts.ts      # Blog posts
│   ├── applications.ts # Team applications
│   └── admin.ts      # Admin routes
├── services/
│   ├── authService.ts # Authentication logic
│   ├── emailService.ts # Email notifications
│   └── uploadService.ts # File handling
└── utils/
    ├── prisma.ts     # Prisma client instance
    └── constants.ts  # Application constants
```

### 3.2 Prisma Client Setup

Create `src/server/utils/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### 3.3 Authentication Service

Create `src/server/services/authService.ts`:

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
    researchInterests?: string[];
  }) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        researchInterests: userData.researchInterests || [],
        role: 'VISITOR',
        status: 'APPROVED'
      }
    });

    return this.generateTokens(user);
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'APPROVED') {
      throw new Error('Account not approved');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    return this.generateTokens(user);
  }

  static generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    };
  }

  static async refreshAccessToken(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'
      ) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
```

## Phase 4: Frontend Integration

### 4.1 Authentication Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@prisma/client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token and get user data
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  const register = async (userData: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 4.2 Protected Route Component

Create `src/components/ProtectedRoute.tsx`:

```typescript
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '@prisma/client';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [UserRole.ADMIN, UserRole.TEAM_MEMBER],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## Phase 5: Admin Approval System

### 5.1 Application Submission Form

Create `src/components/ApplicationForm.tsx`:

```typescript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    motivation: '',
    researchInterests: '',
    expertise: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload CV first
      let cvUrl = '';
      if (cvFile) {
        const formData = new FormData();
        formData.append('file', cvFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadResponse.json();
        cvUrl = uploadData.url;
      }

      // Submit application
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          researchInterests: formData.researchInterests.split(',').map(s => s.trim()),
          expertise: formData.expertise.split(',').map(s => s.trim()),
          cvUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
          <p className="text-green-700">
            Thank you for your interest in joining our research team. 
            We'll review your application and get back to you within 48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Join Our Research Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Motivation Statement *</label>
        <Textarea
          required
          rows={6}
          value={formData.motivation}
          onChange={(e) => setFormData({...formData, motivation: e.target.value})}
          placeholder="Tell us why you want to join our research team..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Research Interests</label>
        <Input
          value={formData.researchInterests}
          onChange={(e) => setFormData({...formData, researchInterests: e.target.value})}
          placeholder="e.g., AI Ethics, Privacy, Mental Health (comma-separated)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Expertise</label>
        <Input
          value={formData.expertise}
          onChange={(e) => setFormData({...formData, expertise: e.target.value})}
          placeholder="e.g., Python, Data Analysis, Qualitative Research (comma-separated)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">CV/Resume *</label>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          required
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
        />
        <p className="text-sm text-gray-500 mt-1">PDF or Word document, max 10MB</p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
};
```

### 5.2 Admin Dashboard

Create `src/pages/AdminDashboard.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '@prisma/client';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export const AdminDashboard: React.FC = () => {
  const { hasRole } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasRole([UserRole.ADMIN])) {
      fetchData();
    }
  }, [hasRole]);

  const fetchData = async () => {
    try {
      const [appsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/applications'),
        fetch('/api/admin/users')
      ]);

      const appsData = await appsResponse.json();
      const usersData = await usersResponse.json();

      setApplications(appsData.applications || []);
      setUsers(usersData.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/approve`, {
        method: 'PUT'
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (applicationId: string, feedback: string) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
              <TabsTrigger value="users">Team Members ({users.length})</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applications">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Pending Applications</h2>
                {applications.filter(app => app.status === 'PENDING').map(application => (
                  <Card key={application.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{application.name}</h3>
                        <p className="text-gray-600">{application.email}</p>
                        <p className="mt-2 text-sm">{application.motivation}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {application.researchInterests?.map((interest: string) => (
                            <span key={interest} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove(application.id)}
                          variant="default"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => {
                            const feedback = prompt('Enter feedback for rejection:');
                            if (feedback) handleReject(application.id, feedback);
                          }}
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.filter(user => user.role !== 'VISITOR').map(user => (
                    <Card key={user.id} className="p-4">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Role: {user.role} | Status: {user.status}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Content Management</h2>
                <p>Content management features coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};
```

## Phase 6: Testing and Deployment

### 6.1 Testing Strategy

1. **Unit Tests**: Test authentication service, validation functions
2. **Integration Tests**: Test API endpoints, database operations
3. **End-to-End Tests**: Test user flows (registration, login, application)

### 6.2 Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates set up
- [ ] Email service configured
- [ ] File storage configured
- [ ] Monitoring and logging enabled
- [ ] Backup procedures established
- [ ] Security audit completed

## Next Steps

1. Review and customize the implementation for your specific needs
2. Set up the development environment
3. Begin with Phase 1 implementation
4. Test each phase thoroughly before proceeding
5. Plan for production deployment

## Support

For issues or questions during implementation, refer to:
- Prisma documentation: https://www.prisma.io/docs
- PostgreSQL documentation: https://www.postgresql.org/docs
- React documentation: https://react.dev