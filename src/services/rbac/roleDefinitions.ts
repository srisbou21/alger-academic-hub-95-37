
import { Role, ModuleAccess, TabAccess, SystemModule, PermissionAction, Permission } from '../../types/rbac';

export const getDefaultRoles = (): Role[] => {
  return [
    {
      id: 'super_admin',
      name: 'Super Administrateur',
      description: 'Accès complet à tous les modules et fonctionnalités du système',
      level: 100,
      permissions: [
        // Permissions globales pour tous les modules
        ...Object.values(SystemModule).flatMap(module => [
          { module, action: PermissionAction.READ },
          { module, action: PermissionAction.WRITE },
          { module, action: PermissionAction.DELETE },
          { module, action: PermissionAction.APPROVE },
          { module, action: PermissionAction.EXPORT }
        ])
      ],
      modules: [
        // Module Admin - Accès complet
        {
          moduleId: SystemModule.ADMIN,
          moduleName: 'Administration',
          canAccess: true,
          tabs: [
            { tabId: 'overview', tabName: 'Vue d\'ensemble', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'users', tabName: 'Utilisateurs', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'absences', tabName: 'Absences', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'academic-years', tabName: 'Années Universitaires', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'administrative', tabName: 'Administrative', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'academic', tabName: 'Académique', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'monitoring', tabName: 'Monitoring', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'audit', tabName: 'Audit', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'protection', tabName: 'Protection', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'system', tabName: 'Configuration', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
          ]
        },
        // Module Teacher - Accès complet
        {
          moduleId: SystemModule.TEACHER,
          moduleName: 'Enseignant',
          canAccess: true,
          tabs: [
            { tabId: 'overview', tabName: 'Vue d\'ensemble', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'workload', tabName: 'Charges', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'absence', tabName: 'Mes Absences', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'communication', tabName: 'Communication', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'profile', tabName: 'Profil', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
          ]
        },
        // Module Faculty - Accès complet
        {
          moduleId: SystemModule.FACULTY,
          moduleName: 'Faculté',
          canAccess: true,
          tabs: [
            { tabId: 'overview', tabName: 'Vue d\'ensemble', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'management', tabName: 'Gestion', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
          ]
        },
        // Module HR - Accès complet
        {
          moduleId: SystemModule.HR,
          moduleName: 'Ressources Humaines',
          canAccess: true,
          tabs: [
            { tabId: 'overview', tabName: 'Vue d\'ensemble', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
            { tabId: 'management', tabName: 'Gestion', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
          ]
        }
      ]
    },
    {
      id: 'admin_faculty',
      name: 'Administrateur Faculté',
      description: 'Gestion des utilisateurs et des accès au niveau de la faculté',
      level: 90,
      permissions: [
        { module: SystemModule.FACULTY, action: PermissionAction.READ },
        { module: SystemModule.FACULTY, action: PermissionAction.WRITE }
      ],
      modules: [
        {
          moduleId: SystemModule.FACULTY,
          moduleName: 'Faculté',
          canAccess: true,
          tabs: [
            { tabId: 'overview', tabName: 'Vue d\'ensemble', canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
            { tabId: 'management', tabName: 'Gestion', canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true }
          ]
        }
      ]
    },
    {
      id: 'teacher',
      name: 'Enseignant',
      description: 'Accès aux fonctionnalités d\'enseignement',
      level: 50,
      permissions: [
        { module: SystemModule.TEACHER, action: PermissionAction.READ },
        { module: SystemModule.TEACHER, action: PermissionAction.WRITE }
      ],
      modules: [
        {
          moduleId: SystemModule.TEACHER,
          moduleName: 'Enseignant',
          canAccess: true,
          tabs: [
            { tabId: 'overview', tabName: 'Vue d\'ensemble', canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
            { tabId: 'workload', tabName: 'Charges', canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
            { tabId: 'absence', tabName: 'Mes Absences', canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
            { tabId: 'communication', tabName: 'Communication', canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
            { tabId: 'profile', tabName: 'Profil', canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true }
          ]
        }
      ]
    }
  ];
};
