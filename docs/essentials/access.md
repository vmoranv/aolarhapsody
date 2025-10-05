# 权限管理

::: tip 说明

项目实现了基于角色的权限控制系统(RBAC),支持前端和后端协同的权限管理.

:::

## 权限系统架构

项目采用前后端协同的权限管理方案：

### 前端权限控制

1. 路由级别权限控制
2. 组件级别权限控制
3. 操作按钮级别权限控制

### 后端权限控制

1. API 接口权限验证
2. 数据访问权限控制
3. 角色和权限管理

## 权限模型设计

### 角色定义

```ts
// frontend/src/types/auth.ts
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// 默认角色定义
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
```

### 权限定义

```ts
// frontend/src/types/auth.ts
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

// 常用权限定义
export const PERMISSIONS = {
  // 宠物相关权限
  PET_READ: 'pet:read',
  PET_CREATE: 'pet:create',
  PET_UPDATE: 'pet:update',
  PET_DELETE: 'pet:delete',

  // 道具相关权限
  ITEM_READ: 'item:read',
  ITEM_CREATE: 'item:create',
  ITEM_UPDATE: 'item:update',
  ITEM_DELETE: 'item:delete',

  // 用户管理权限
  USER_MANAGE: 'user:manage',

  // 系统设置权限
  SYSTEM_SETTINGS: 'system:settings',
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
```

### 用户模型

```ts
// frontend/src/types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: RoleType;
  permissions: PermissionType[];
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
}
```

## 前端权限实现

### 权限上下文

```tsx
// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RoleType, PermissionType } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: PermissionType) => boolean;
  hasRole: (role: RoleType) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 检查本地存储的认证信息
    const token = localStorage.getItem('authToken');
    if (token) {
      // 验证token并获取用户信息
      validateToken(token)
        .then((userData) => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('登录失败');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: PermissionType): boolean => {
    if (!user) return false;

    // 管理员拥有所有权限
    if (user.role === 'admin') return true;

    // 检查用户是否拥有特定权限
    return user.permissions.includes(permission);
  };

  const hasRole = (role: RoleType): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 路由权限控制

```tsx
// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { PermissionType, RoleType } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionType;
  requiredRole?: RoleType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
}) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### 组件权限控制

```tsx
// frontend/src/components/PermissionGuard.tsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { PermissionType } from '@/types/auth';

interface PermissionGuardProps {
  permission: PermissionType;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children,
}) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
```

### 操作按钮权限控制

```tsx
// frontend/src/components/PermissionButton.tsx
import React from 'react';
import { Button, ButtonProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import type { PermissionType } from '@/types/auth';

interface PermissionButtonProps extends ButtonProps {
  permission: PermissionType;
}

const PermissionButton: React.FC<PermissionButtonProps> = ({ permission, ...props }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return null;
  }

  return <Button {...props} />;
};

export default PermissionButton;
```

## 后端权限实现

### 权限中间件

```ts
// backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded as any;
    next();
  } catch (error) {
    return res.status(401).json({ error: '无效的认证令牌' });
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }

    // 管理员拥有所有权限
    if (req.user.role === 'admin') {
      return next();
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: '权限不足' });
    }

    next();
  };
};

export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '未认证' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: '角色权限不足' });
    }

    next();
  };
};
```

### 路由权限应用

```ts
// backend/routes/pets.ts
import { Router } from 'express';
import { authenticate, requirePermission } from '../middleware/auth';
import { getPets, createPet, updatePet, deletePet } from '../controllers/petController';

const router = Router();

// 获取宠物列表 - 所有认证用户都可以访问
router.get('/', authenticate, getPets);

// 创建宠物 - 需要 PET_CREATE 权限
router.post('/', authenticate, requirePermission('pet:create'), createPet);

// 更新宠物 - 需要 PET_UPDATE 权限
router.put('/:id', authenticate, requirePermission('pet:update'), updatePet);

// 删除宠物 - 需要 PET_DELETE 权限
router.delete('/:id', authenticate, requirePermission('pet:delete'), deletePet);

export default router;
```

### 用户服务

```ts
// backend/services/userService.ts
import jwt from 'jsonwebtoken';
import { User, Role, Permission } from '../types/auth';

// 角色权限映射
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'pet:read',
    'pet:create',
    'pet:update',
    'pet:delete',
    'item:read',
    'item:create',
    'item:update',
    'item:delete',
    'user:manage',
    'system:settings',
  ],
  user: ['pet:read', 'item:read'],
  guest: ['pet:read'],
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    role: user.role,
    permissions: user.permissions,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '24h',
  });
};

export const getUserPermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role] || [];
};

export const validateUserPermissions = (
  userPermissions: string[],
  requiredPermission: string
): boolean => {
  // 管理员拥有所有权限
  if (userPermissions.includes('admin')) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
};
```
