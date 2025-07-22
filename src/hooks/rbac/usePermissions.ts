
import { useCallback } from 'react';
import { User } from '../../types/user';
import { SystemModule, PermissionAction } from '../../types/rbac';
import { rbacService } from '../../services/rbacService';

export const usePermissions = (currentUser: User | null) => {
  const hasPermission = useCallback((
    module: SystemModule, 
    action: PermissionAction, 
    tabId?: string
  ): boolean => {
    if (!currentUser) {
      return false;
    }
    
    // Super Admin a TOUS les accès automatiquement
    if (currentUser.role === 'super_admin') {
      return true;
    }
    
    // Vérifications spéciales pour les rôles administratifs
    const adminRoles = ['admin_faculty', 'dept_head', 'vice_dean_pedagogy', 'vice_dean_postgrad', 
                       'domain_manager', 'planning_service_head', 'secretary_general'];
    
    if (adminRoles.includes(currentUser.role)) {
      if (module === SystemModule.ADMIN || module === SystemModule.HR) {
        return true;
      }
    }
    
    return rbacService.hasPermission(currentUser, module, action, tabId);
  }, [currentUser]);

  const canAccessModule = useCallback((module: SystemModule): boolean => {
    if (!currentUser) return false;
    
    // Super Admin peut accéder à TOUS les modules
    if (currentUser.role === 'super_admin') {
      return true;
    }
    
    // Accès spéciaux pour les rôles administratifs
    const adminRoles = ['admin_faculty', 'dept_head', 'vice_dean_pedagogy', 'vice_dean_postgrad', 
                       'domain_manager', 'planning_service_head', 'secretary_general'];
    
    if (adminRoles.includes(currentUser.role)) {
      if ([SystemModule.ADMIN, SystemModule.HR, SystemModule.FACULTY].includes(module)) {
        return true;
      }
    }
    
    return hasPermission(module, PermissionAction.READ);
  }, [currentUser, hasPermission]);

  return {
    hasPermission,
    canAccessModule
  };
};
