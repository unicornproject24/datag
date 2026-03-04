# Prisma Database Implementation Requirements Document

## Project Overview

This document outlines the requirements for migrating the Data wellbeing Group Webpage from Supabase to Prisma with PostgreSQL, including the implementation of a role-based admin approval system for team members.

## Current System Analysis

### Existing Architecture
- **Frontend**: React 18 with TypeScript, Vite
- **Current Database**: Supabase (key-value store)
- **Authentication**: None (public access)
- **Data Management**: Serverless functions with key-value storage

### Migration Target
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **Admin System**: Approval workflow for team members
- **Data Models**: Relational database schema

## Database Configuration

### Connection String
```
DATABASE_URL="postgres://ab8b25ecbc3795b604e198148256406958da991ce2890f4d30e542d633989f26:sk_kY0ETtOrIVmDJ1ZIJYkcO@db.prisma.io:5432/postgres?sslmode=require&pool=true"
```

### Environment Setup
Create `.env` file in project root:
```env
DATABASE_URL="postgres://ab8b25ecbc3795b604e198148256406958da991ce2890f4d30e542d633989f26:sk_kY0ETtOrIVmDJ1ZIJYkcO@db.prisma.io:5432/postgres?sslmode=require&pool=true"
JWT_SECRET="your-jwt-secret-key-here"
ADMIN_EMAIL="admin@datawellbeing.org"
```

## Prisma Schema Requirements

### Core Data Models

```prisma
// User roles for access control
enum UserRole {
  VISITOR
  TEAM_MEMBER
  ADMIN
}

// User status for approval workflow
enum UserStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

// Content status for moderation
enum ContentStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
  PUBLISHED
}

// Main user model
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  name          String
  role          UserRole   @default(VISITOR)
  status        UserStatus @default(PENDING)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  lastLogin     DateTime?
  
  // Profile information
  bio           String?
  researchInterests String[]
  photoUrl      String?
  socialLinks   Json?
  isPublic      Boolean    @default(false)
  
  // Relationships
  authoredPosts      Post[]
  authoredPapers     ResearchPaper[]
  applications       Application[]
  approvedBy         User?      @relation("UserApprover", fields: [approvedById], references: [id])
  approvedById       String?
  approvedUsers      User[]     @relation("UserApprover")
  
  @@map("users")
}

// Research papers
model ResearchPaper {
  id            String        @id @default(uuid())
  title         String
  authors       String[]
  abstract      String
  keywords      String[]
  pdfUrl        String?
  doiLink       String?
  publishedDate DateTime
  category      String
  status        ContentStatus @default(DRAFT)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relationships
  author        User          @relation(fields: [authorId], references: [id])
  authorId      String
  approvedBy    User?         @relation("PaperApprover", fields: [approvedById], references: [id])
  approvedById  String?
  
  @@map("research_papers")
}

// Blog posts
model Post {
  id            String        @id @default(uuid())
  title         String
  content       String
  excerpt       String
  tags          String[]
  category      String
  status        ContentStatus @default(DRAFT)
  publishedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relationships
  author        User          @relation(fields: [authorId], references: [id])
  authorId      String
  approvedBy    User?         @relation("PostApprover", fields: [approvedById], references: [id])
  approvedById  String?
  
  @@map("blog_posts")
}

// Team member applications
model Application {
  id            String     @id @default(uuid())
  email         String
  name          String
  motivation    String
  cvUrl         String
  researchInterests String[]
  status        UserStatus @default(PENDING)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  // Relationships
  reviewedBy    User?      @relation("ApplicationReviewer", fields: [reviewedById], references: [id])
  reviewedById  String?
  
  @@map("applications")
}

// System settings
model Setting {
  id            String   @id @default(uuid())
  key           String   @unique
  value         String
  description   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("settings")
}
```

## Authentication System Requirements

### JWT Implementation
- **Library**: `jsonwebtoken` or `jose`
- **Token Expiration**: 24 hours for access tokens
- **Refresh Tokens**: 7 days validity
- **Role-based Claims**: Include user role in token payload

### Protected Routes
```typescript
// Route protection middleware
const requireAuth = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verify JWT token
    // Check user role against allowedRoles
    // Proceed or return 403
  };
};
```

## Admin Approval System

### Team Member Approval Workflow

#### 1. Application Submission
- Prospective members submit applications via form
- Required fields: name, email, motivation, CV upload, research interests
- Application status defaults to `PENDING`

#### 2. Admin Review Interface
- Admin dashboard showing pending applications
- Filter by status, date, research interests
- View application details including CV
- Action buttons: Approve, Reject, Request Changes

#### 3. Approval Process
- **Approve**: 
  - Creates new User record with `TEAM_MEMBER` role
  - Sets status to `APPROVED`
  - Sends welcome email with login instructions
- **Reject**:
  - Sets application status to `REJECTED`
  - Sends rejection email with feedback
- **Request Changes**:
  - Sets status to `PENDING` with feedback
  - Notifies applicant to update submission

#### 4. User Management
- Admins can view all team members
- Suspend/reactivate accounts
- Update user roles
- Reset passwords

### Content Approval Workflow

#### Blog Posts
- Team members create draft posts
- Submit for admin approval
- Admins review content, formatting, accuracy
- Approve or request revisions

#### Research Papers
- Admins upload papers with metadata
- Automatic validation of required fields
- DOI link verification
- Publication date validation

## API Endpoints

### Authentication
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/refresh - Token refresh
GET /api/auth/profile - Get user profile
PUT /api/auth/profile - Update profile
```

### Admin Endpoints
```
GET /api/admin/applications - Get pending applications
PUT /api/admin/applications/:id/approve - Approve application
PUT /api/admin/applications/:id/reject - Reject application
GET /api/admin/users - Get all users
PUT /api/admin/users/:id/status - Update user status
PUT /api/admin/users/:id/role - Update user role
```

### Content Management
```
GET /api/papers - Get published papers
POST /api/papers - Create new paper (admin only)
PUT /api/papers/:id - Update paper (admin only)
DELETE /api/papers/:id - Delete paper (admin only)

GET /api/posts - Get published posts
POST /api/posts - Create new post
PUT /api/posts/:id - Update post
DELETE /api/posts/:id - Delete post
```

### Public Endpoints
```
GET /api/team - Get approved team members
GET /api/team/:id - Get specific team member
GET /api/research - Get published research papers
GET /api/blog - Get published blog posts
POST /api/contact - Submit contact form
POST /api/apply - Submit team member application
```

## Frontend Implementation

### Authentication Context
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implementation with JWT handling
};
```

### Protected Route Component
```typescript
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: UserRole[] 
}> = ({ children, allowedRoles }) => {
  // Check authentication and role permissions
};
```

### Admin Dashboard Components
- Application review panel
- User management table
- Content moderation interface
- Analytics and statistics

## Migration Plan

### Phase 1: Setup and Configuration
1. Install Prisma dependencies
2. Configure database connection
3. Create initial Prisma schema
4. Set up environment variables

### Phase 2: Data Models and Migrations
1. Define all data models
2. Create database migrations
3. Set up seed data for initial admin user
4. Implement basic CRUD operations

### Phase 3: Authentication System
1. Implement JWT authentication
2. Create login/logout functionality
3. Add route protection middleware
4. Test authentication flows

### Phase 4: Admin Approval System
1. Create application submission form
2. Build admin review interface
3. Implement approval workflow
4. Add email notifications

### Phase 5: Content Management
1. Migrate existing content to new database
2. Implement content approval workflows
3. Create admin content management interface
4. Add search and filtering capabilities

### Phase 6: Testing and Deployment
1. Comprehensive testing of all features
2. Performance optimization
3. Security audit
4. Production deployment

## Security Considerations

### Data Protection
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention through Prisma
- XSS protection in frontend

### Access Control
- Role-based permissions
- JWT token validation
- Session management
- Rate limiting for API endpoints

### Privacy Compliance
- GDPR compliance for user data
- Data retention policies
- User data export capabilities
- Right to deletion implementation

## Testing Requirements

### Unit Tests
- Authentication service
- Database operations
- Validation functions
- Utility functions

### Integration Tests
- API endpoint testing
- Authentication flows
- Approval workflows
- Data persistence

### End-to-End Tests
- User registration and login
- Application submission and approval
- Content creation and publication
- Admin dashboard functionality

## Monitoring and Maintenance

### Logging
- Error logging with context
- User activity tracking
- Performance monitoring
- Database query logging

### Backup Strategy
- Automated database backups
- Point-in-time recovery
- Cross-region replication
- Backup validation procedures

### Performance Optimization
- Database indexing
- Query optimization
- Caching strategies
- Load testing

## Success Metrics

### Technical Metrics
- API response times < 200ms
- Database query performance < 100ms
- 99.9% uptime
- Zero data loss incidents

### User Experience Metrics
- Application approval time < 48 hours
- User registration completion rate > 90%
- Admin dashboard load time < 2 seconds
- Error rate < 1%

### Business Metrics
- Team member growth rate
- Content publication frequency
- User engagement metrics
- System adoption rate

## Dependencies to Install

```bash
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install @types/jsonwebtoken @types/bcryptjs
npm install multer  # for file uploads
npm install nodemailer  # for email notifications
```

## Development Timeline

### Estimated Implementation Time: 4-6 weeks

**Week 1-2**: Database setup, authentication, basic models
**Week 3**: Admin approval system, application workflow
**Week 4**: Content management, approval workflows
**Week 5**: Testing, security audit, optimization
**Week 6**: Deployment, documentation, training

## Risk Assessment

### High Priority Risks
- Data migration complexity
- Authentication security vulnerabilities
- Performance with large datasets

### Mitigation Strategies
- Thorough testing before migration
- Security code reviews
- Database optimization and indexing
- Staged rollout with rollback capability

## Next Steps

1. Review and approve this requirements document
2. Set up development environment with PostgreSQL
3. Create initial Prisma schema
4. Begin implementation of Phase 1
5. Schedule regular progress reviews