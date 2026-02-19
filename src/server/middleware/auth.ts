import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const user = await AuthService.verifyToken(token);

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// This would require importing UserRole from Prisma
// Since we don't have access to Prisma types directly here, we'll implement a simpler version
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Middleware to require admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Middleware to require team member or admin role
export const requireTeamMember = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEAM_MEMBER')) {
    return res.status(403).json({ error: 'Team member access required' });
  }
  
  next();
};