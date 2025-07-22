
export enum SystemModule {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  HR = 'hr',
  FACULTY = 'faculty',
  FORMATIONS = 'formations',
  RESERVATIONS = 'reservations',
  STATISTICS = 'statistics',
  TIMETABLE = 'timetable',
  SCHOLARSHIPS = 'scholarships',
  PLANNING = 'planning',
  WORKLOAD = 'workload',
  ACADEMIC = 'academic',
  ADMINISTRATIVE = 'administrative'
}

export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  APPROVE = 'approve',
  EXPORT = 'export'
}

export interface Permission {
  module: SystemModule;
  action: PermissionAction;
  tabId?: string;
}

export interface TabAccess {
  tabId: string;
  tabName: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove?: boolean;
  canExport?: boolean;
}

export interface ProfileAccess {
  profileId: string;
  profileName: string;
  canView: boolean;
  canEdit: boolean;
  canAssign: boolean;
}

export interface ModuleAccess {
  moduleId: SystemModule;
  moduleName: string;
  canAccess: boolean;
  tabs: TabAccess[];
  profiles?: ProfileAccess[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: Permission[];
  modules: ModuleAccess[];
}
