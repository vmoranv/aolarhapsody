# Access Control

::: tip Note

The project implements a Role-Based Access Control (RBAC) system that supports collaborative permission management between frontend and backend.

:::

## Permission System Architecture

The project adopts a collaborative permission management solution between frontend and backend:

### Frontend Permission Control

1. Route-level permission control
2. Component-level permission control
3. Operation button-level permission control

### Backend Permission Control

1. API interface permission verification
2. Data access permission control
3. Role and permission management

## Permission Model Design

### Role Definition

```ts
// frontend/src/types/auth.ts
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// Default role definitions
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
```

### Permission Definition

```ts
// frontend/src/types/auth.ts
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Common permissions
export const PERMISSIONS = {
  // User management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Role management
  ROLE_ASSIGN: 'role:assign',

  // Data access
  DATA_READ: 'data:read',
  DATA_WRITE: 'data:write',
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
```

## Implementation Details

### Frontend Implementation

#### 1. Authentication Store

The authentication state is managed using Zustand:

```ts
// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { Role, Permission } from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    roles: Role[];
    permissions: Permission[];
  } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,

  login: async (username, password) => {
    // Login logic
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { user, token } = await response.json();
      localStorage.setItem('token', token);
      set({ isAuthenticated: true, user });
    } else {
      throw new Error('Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null });
  },

  hasPermission: (permission) => {
    const { user } = get();
    return user?.permissions?.some((p) => p.id === permission) || false;
  },

  hasRole: (role) => {
    const { user } = get();
    return user?.roles?.some((r) => r.id === role) || false;
  },
}));
```

#### 2. Route-level Permission Control

Route permissions are controlled using React Router:

```tsx
// frontend/src/router/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions
  const hasRequiredPermissions = requiredPermissions.every(hasPermission);
  const hasRequiredRoles = requiredRoles.every(hasRole);

  if (requiredPermissions.length > 0 && !hasRequiredPermissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRoles.length > 0 && !hasRequiredRoles) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

#### 3. Component-level Permission Control

Create a permission-based component wrapper:

```tsx
// frontend/src/components/PermissionGuard.tsx
import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface PermissionGuardProps {
  permissions?: string[];
  roles?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions = [],
  roles = [],
  fallback = null,
  children,
}) => {
  const { hasPermission, hasRole } = useAuthStore();

  // Check permissions
  const hasRequiredPermissions = permissions.every(hasPermission);
  const hasRequiredRoles = roles.every(hasRole);

  // Show content if either permissions or roles are satisfied
  const shouldShowContent =
    (permissions.length === 0 || hasRequiredPermissions) &&
    (roles.length === 0 || hasRequiredRoles);

  return shouldShowContent ? <>{children}</> : <>{fallback}</>;
};
```

#### 4. Button-level Permission Control

Create a permission-based button component:

```tsx
// frontend/src/components/PermissionButton.tsx
import React from 'react';
import { Button, ButtonProps } from 'antd';
import { useAuthStore } from '@/store/authStore';

interface PermissionButtonProps extends ButtonProps {
  permissions?: string[];
  roles?: string[];
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  permissions = [],
  roles = [],
  ...buttonProps
}) => {
  const { hasPermission, hasRole } = useAuthStore();

  // Check permissions
  const hasRequiredPermissions = permissions.every(hasPermission);
  const hasRequiredRoles = roles.every(hasRole);

  // Show button if either permissions or roles are satisfied
  const shouldShowButton =
    (permissions.length === 0 || hasRequiredPermissions) &&
    (roles.length === 0 || hasRequiredRoles);

  if (!shouldShowButton) {
    return null;
  }

  return <Button {...buttonProps} />;
};
```

### Backend Implementation

#### 1. Permission Middleware

Express middleware for permission checking:

```ts
// backend/middleware/permissionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole, UserPermission } from '../types/auth';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: UserRole[];
    permissions: UserPermission[];
  };
}

export const requirePermission = (...permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userPermissions = req.user.permissions.map((p) => p.id);
    const hasPermission = permissions.every((permission) => userPermissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = req.user.roles.map((r) => r.id);
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient role' });
    }

    next();
  };
};
```

#### 2. Route Protection

Using middleware to protect routes:

```ts
// backend/routes/userRoutes.ts
import express from 'express';
import { requirePermission, requireRole } from '../middleware/permissionMiddleware';

const router = express.Router();

// Admin-only route
router.get('/admin/users', requireRole('admin'), (req, res) => {
  // Get all users
  res.json(users);
});

// Permission-based route
router.delete('/users/:id', requirePermission('user:delete'), (req, res) => {
  const { id } = req.params;
  // Delete user logic
  res.json({ success: true });
});

export default router;
```
