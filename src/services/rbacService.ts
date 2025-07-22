
import { User } from '../types/user';
import { SystemModule, PermissionAction, Role } from '../types/rbac';
import { getDefaultRoles } from './rbac/roleDefinitions';

class RBACService {
  private roles: Role[] = getDefaultRoles();

  hasPermission(user: User, module: SystemModule, action: PermissionAction, tabId?: string): boolean {
    if (user.role === 'super_admin') {
      return true;
    }

    return user.permissions?.some(permission => 
      permission.module === module && 
      permission.action === action &&
      (!tabId || permission.tabId === tabId)
    ) || false;
  }

  getAccessibleModules(user: User) {
    const role = this.getUserRole(user);
    if (!role) {
      return [];
    }

    if (user.role === 'super_admin') {
      return role.modules;
    }

    return role.modules.filter(module => module.canAccess);
  }

  getAccessibleTabs(user: User, moduleId: SystemModule) {
    const role = this.getUserRole(user);
    if (!role) {
      return [];
    }

    const module = role.modules.find(m => m.moduleId === moduleId);
    return module ? module.tabs : [];
  }

  canAccessProfile(user: User, profileId: string): boolean {
    return user.role === 'super_admin' || user.id === profileId;
  }

  getUserRole(user: User): Role | null {
    const role = this.roles.find(r => r.id === user.role);
    if (role) {
      return role;
    }

    // Fallback for basic role info
    return {
      id: user.role,
      name: user.role,
      description: `Rôle ${user.role}`,
      level: user.role === 'super_admin' ? 100 : 50,
      permissions: user.permissions || [],
      modules: []
    };
  }
}

export const rbacService = new RBACService();
