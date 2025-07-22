
import { User } from '../types/user';

export interface AbsencePermissions {
  canViewOwnAbsences: boolean;
  canRequestAbsence: boolean;
  canViewDepartmentAbsences: boolean;
  canViewAllAbsences: boolean;
  canApproveAbsences: boolean;
  canViewStatistics: boolean;
  canManageReplacements: boolean;
  canViewAdvancedTracking: boolean;
  canViewTeacherGraphics: boolean;
  canViewAllTeachersAbsences: boolean; // NOUVELLE PERMISSION
  canFilterByDateRange: boolean; // NOUVELLE PERMISSION
  canFilterByDepartment: boolean; // NOUVELLE PERMISSION
  canFilterByAcademicYear: boolean; // NOUVELLE PERMISSION
  department?: string;
}

export const permissionService = {
  getAbsencePermissions(user: User): AbsencePermissions {
    const basePermissions: AbsencePermissions = {
      canViewOwnAbsences: false,
      canRequestAbsence: false,
      canViewDepartmentAbsences: false,
      canViewAllAbsences: false,
      canApproveAbsences: false,
      canViewStatistics: false,
      canManageReplacements: false,
      canViewAdvancedTracking: false,
      canViewTeacherGraphics: false,
      canViewAllTeachersAbsences: false,
      canFilterByDateRange: false,
      canFilterByDepartment: false,
      canFilterByAcademicYear: false
    };

    switch (user.role) {
      case 'super_admin':
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canViewAllAbsences: true,
          canApproveAbsences: true,
          canViewStatistics: true,
          canManageReplacements: true,
          canViewAdvancedTracking: true,
          canViewTeacherGraphics: true,
          canViewAllTeachersAbsences: true, // ACCÈS COMPLET
          canFilterByDateRange: true,
          canFilterByDepartment: true,
          canFilterByAcademicYear: true
        };

      case 'admin_faculty': // DOYEN
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canViewAllAbsences: true,
          canApproveAbsences: true,
          canViewStatistics: true,
          canManageReplacements: true,
          canViewAdvancedTracking: true,
          canViewTeacherGraphics: true,
          canViewAllTeachersAbsences: true, // ACCÈS COMPLET FACULTÉ
          canFilterByDateRange: true,
          canFilterByDepartment: true,
          canFilterByAcademicYear: true
        };

      case 'dept_head': // CHEF DE DÉPARTEMENT
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canViewDepartmentAbsences: true,
          canViewAllAbsences: true,
          canApproveAbsences: true,
          canViewStatistics: true,
          canManageReplacements: true,
          canViewAdvancedTracking: true,
          canViewTeacherGraphics: true,
          canViewAllTeachersAbsences: true, // ACCÈS COMPLET DÉPARTEMENT
          canFilterByDateRange: true,
          canFilterByDepartment: false, // Limité à son département
          canFilterByAcademicYear: true,
          department: user.department
        };

      case 'planning_service_head': // RESPONSABLE PROGRAMMATION ET SUIVI
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canViewAllAbsences: true,
          canViewStatistics: true,
          canManageReplacements: true,
          canViewAdvancedTracking: true,
          canViewTeacherGraphics: true,
          canViewAllTeachersAbsences: true, // ACCÈS COMPLET POUR PLANNING
          canFilterByDateRange: true,
          canFilterByDepartment: true,
          canFilterByAcademicYear: true
        };

      case 'pedagogy_head':
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canViewDepartmentAbsences: true,
          canViewAllAbsences: true,
          canViewStatistics: true,
          canViewAdvancedTracking: true,
          canViewTeacherGraphics: true,
          canViewAllTeachersAbsences: true, // ACCÈS COMPLET PÉDAGOGIE
          canFilterByDateRange: true,
          canFilterByDepartment: true,
          canFilterByAcademicYear: true,
          department: user.department
        };

      case 'teacher':
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canRequestAbsence: true
        };

      case 'admin_staff':
        return {
          ...basePermissions,
          canViewOwnAbsences: true,
          canViewDepartmentAbsences: true,
          canViewStatistics: true,
          canViewAdvancedTracking: true,
          canViewTeacherGraphics: true,
          department: user.department
        };

      default:
        return basePermissions;
    }
  },

  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'super_admin': 'Super Administrateur',
      'admin_faculty': 'Doyen',
      'dept_head': 'Chef de Département',
      'planning_service_head': 'Responsable Programmation et Suivi',
      'pedagogy_head': 'Responsable Pédagogie',
      'teacher': 'Enseignant',
      'admin_staff': 'Personnel Administratif',
      'vice_dean_pedagogy': 'Vice Doyen Pédagogie',
      'vice_dean_postgrad': 'Vice Doyen Post-Graduation',
      'domain_manager': 'Responsable de Domaine',
      'budget_service_head': 'Chef Service Budget',
      'secretary_general': 'Secrétaire Général',
      'accountant': 'Comptable',
      'custom_profile': 'Profil Personnalisé'
    };
    return roleNames[role] || role;
  }
};
