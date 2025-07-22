
import { SystemModule, PermissionAction } from './rbac';

export interface Permission {
  module: SystemModule;
  action: PermissionAction;
  tabId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_faculty' | 'dept_head' | 'pedagogy_head' | 'teacher' | 'admin_staff' | 
        'vice_dean_pedagogy' | 'vice_dean_postgrad' | 'domain_manager' | 'planning_service_head' | 
        'budget_service_head' | 'secretary_general' | 'accountant' | 'custom_profile';
  department: string;
  permissions: Permission[];
  status: 'active' | 'inactive';
}
