
import { useCallback } from 'react';
import { User } from '../types/user';
import { SystemModule, PermissionAction } from '../types/rbac';
import { rbacService } from '../services/rbacService';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from './rbac/usePermissions';
import { useRoleChecks } from './rbac/useRoleChecks';

export const useRBAC = () => {
  const { user: authUser } = useAuth();

  // Convertir l'utilisateur d'authentification en utilisateur avec rôle pour RBAC
  const currentUser: User | null = authUser ? {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    role: authUser.role as 'super_admin' | 'admin_faculty' | 'dept_head' | 'pedagogy_head' | 'teacher' | 'admin_staff' | 
          'vice_dean_pedagogy' | 'vice_dean_postgrad' | 'domain_manager' | 'planning_service_head' | 
          'budget_service_head' | 'secretary_general' | 'accountant' | 'custom_profile',
    department: authUser.role === 'super_admin' ? "Administration" : "Informatique",
    permissions: [],
    status: "active"
  } : null;

  const { hasPermission, canAccessModule } = usePermissions(currentUser);
  const { isSuperAdmin, isTeacher, isAdmin } = useRoleChecks(currentUser);

  const canEditInModule = useCallback((module: SystemModule, tabId?: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return hasPermission(module, PermissionAction.WRITE, tabId);
  }, [currentUser, hasPermission]);

  const canDeleteInModule = useCallback((module: SystemModule, tabId?: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return hasPermission(module, PermissionAction.DELETE, tabId);
  }, [currentUser, hasPermission]);

  const canApproveInModule = useCallback((module: SystemModule, tabId?: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return hasPermission(module, PermissionAction.APPROVE, tabId);
  }, [currentUser, hasPermission]);

  const canExportFromModule = useCallback((module: SystemModule, tabId?: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return hasPermission(module, PermissionAction.EXPORT, tabId);
  }, [currentUser, hasPermission]);

  const getAccessibleModules = useCallback(() => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'super_admin') {
      return Object.values(SystemModule).map(module => ({
        moduleId: module,
        moduleName: module,
        canAccess: true,
        tabs: []
      }));
    }
    
    return rbacService.getAccessibleModules(currentUser);
  }, [currentUser]);

  const getAccessibleTabs = useCallback((moduleId: SystemModule) => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') return [];
    return rbacService.getAccessibleTabs(currentUser, moduleId);
  }, [currentUser]);

  const canAccessProfile = useCallback((profileId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return rbacService.canAccessProfile(currentUser, profileId);
  }, [currentUser]);

  const getUserRole = useCallback(() => {
    if (!currentUser) return null;
    return rbacService.getUserRole(currentUser);
  }, [currentUser]);

  return {
    hasPermission,
    canAccessModule,
    canEditInModule,
    canDeleteInModule,
    canApproveInModule,
    canExportFromModule,
    getAccessibleModules,
    getAccessibleTabs,
    canAccessProfile,
    getUserRole,
    isSuperAdmin,
    isTeacher,
    isAdmin,
    currentUser
  };
};
