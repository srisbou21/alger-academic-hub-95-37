
import { ModuleAccess, TabAccess, ProfileAccess, SystemModule } from '../../types/rbac';

export const createModuleAccess = (
  moduleId: SystemModule, 
  canAccess: boolean, 
  canEdit: boolean, 
  canDelete: boolean, 
  canApprove: boolean, 
  canExport: boolean
): ModuleAccess => {
  return {
    moduleId,
    moduleName: getModuleName(moduleId),
    canAccess,
    tabs: getModuleTabs(moduleId, canAccess, canEdit, canDelete, canApprove, canExport),
    profiles: getModuleProfiles(moduleId, canAccess, canEdit)
  };
};

export const getAllModulesAccess = (
  canAccess: boolean, 
  canEdit: boolean, 
  canDelete: boolean, 
  canApprove: boolean, 
  canExport: boolean
): ModuleAccess[] => {
  return Object.values(SystemModule).map(module => 
    createModuleAccess(module, canAccess, canEdit, canDelete, canApprove, canExport)
  );
};

export const getModuleName = (moduleId: SystemModule): string => {
  const names = {
    [SystemModule.FACULTY]: 'Faculté',
    [SystemModule.TEACHER]: 'Enseignant',
    [SystemModule.HR]: 'Ressources Humaines',
    [SystemModule.ADMIN]: 'Administration',
    [SystemModule.FORMATIONS]: 'Formations',
    [SystemModule.RESERVATIONS]: 'Réservations',
    [SystemModule.STATISTICS]: 'Statistiques',
    [SystemModule.TIMETABLE]: 'Emploi du Temps'
  };
  return names[moduleId];
};

export const getModuleTabs = (
  moduleId: SystemModule, 
  canView: boolean, 
  canEdit: boolean, 
  canDelete: boolean, 
  canApprove: boolean, 
  canExport: boolean
): TabAccess[] => {
  const tabsMap = {
    [SystemModule.TEACHER]: [
      { tabId: 'overview', tabName: 'Vue d\'ensemble' },
      { tabId: 'workload', tabName: 'Charges' },
      { tabId: 'absence', tabName: 'Absences' },
      { tabId: 'communication', tabName: 'Communication' },
      { tabId: 'profile', tabName: 'Profil' }
    ],
    [SystemModule.HR]: [
      { tabId: 'overview', tabName: 'Vue d\'ensemble' },
      { tabId: 'advancement', tabName: 'Avancements' },
      { tabId: 'echelon', tabName: 'Échelons' },
      { tabId: 'reports', tabName: 'Rapports' },
      { tabId: 'notifications', tabName: 'Notifications' },
      { tabId: 'config', tabName: 'Configuration' }
    ],
    [SystemModule.ADMIN]: [
      { tabId: 'users', tabName: 'Utilisateurs' },
      { tabId: 'permissions', tabName: 'Permissions' },
      { tabId: 'config', tabName: 'Configuration' }
    ]
  };

  const defaultTabs = [
    { tabId: 'overview', tabName: 'Vue d\'ensemble' }
  ];

  const tabs = tabsMap[moduleId] || defaultTabs;

  return tabs.map(tab => ({
    tabId: tab.tabId,
    tabName: tab.tabName,
    canView,
    canEdit,
    canDelete,
    canApprove,
    canExport
  }));
};

export const getModuleProfiles = (moduleId: SystemModule, canView: boolean, canEdit: boolean): ProfileAccess[] => {
  if (moduleId === SystemModule.TEACHER) {
    return [
      {
        profileId: 'permanent',
        profileName: 'Professeur Permanent',
        canView,
        canEdit,
        canAssign: canEdit
      },
      {
        profileId: 'vacataire',
        profileName: 'Enseignant Vacataire',
        canView,
        canEdit,
        canAssign: canEdit
      },
      {
        profileId: 'directeur',
        profileName: 'Directeur de Mémoire',
        canView,
        canEdit,
        canAssign: canEdit
      },
      {
        profileId: 'responsable',
        profileName: 'Responsable d\'UE',
        canView,
        canEdit,
        canAssign: canEdit
      }
    ];
  }
  return [];
};
