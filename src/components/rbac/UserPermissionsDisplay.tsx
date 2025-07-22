
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, Edit, Trash2, CheckCircle, Download } from "lucide-react";
import { useRBAC } from '../../hooks/useRBAC';
import { UserProfile } from './permissions/UserProfile';
import { ModuleAccessCard } from './permissions/ModuleAccessCard';
import { SystemModule } from '../../types/rbac';

export const UserPermissionsDisplay: React.FC = () => {
  const { getUserRole, getAccessibleModules, getAccessibleTabs, currentUser } = useRBAC();
  const [selectedModule, setSelectedModule] = useState<SystemModule | null>(null);

  const userRole = getUserRole();
  const accessibleModules = getAccessibleModules();

  if (!userRole || !currentUser) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <p className="text-amber-800">Aucun rôle défini pour cet utilisateur</p>
        </CardContent>
      </Card>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'canView': return <Eye className="h-3 w-3" />;
      case 'canEdit': return <Edit className="h-3 w-3" />;
      case 'canDelete': return <Trash2 className="h-3 w-3" />;
      case 'canApprove': return <CheckCircle className="h-3 w-3" />;
      case 'canExport': return <Download className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  const getActionColor = (hasPermission: boolean) => {
    return hasPermission 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      <UserProfile 
        currentUser={currentUser}
        userRole={userRole}
        accessibleModulesCount={accessibleModules.length}
      />

      {/* Permissions par module */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Détail des Permissions par Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="profiles">Profils</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessibleModules.map((module) => (
                  <ModuleAccessCard
                    key={module.moduleId}
                    module={module}
                    isSelected={selectedModule === module.moduleId}
                    onClick={() => setSelectedModule(module.moduleId as SystemModule)}
                  />
                ))}
              </div>

              {/* Détail du module sélectionné */}
              {selectedModule && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800">
                      Détail des permissions - {accessibleModules.find(m => m.moduleId === selectedModule)?.moduleName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getAccessibleTabs(selectedModule).map((tab) => (
                        <div key={tab.tabId} className="bg-white p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">{tab.tabName}</h5>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {[
                              { key: 'canView', label: 'Voir', value: tab.canView },
                              { key: 'canEdit', label: 'Modifier', value: tab.canEdit },
                              { key: 'canDelete', label: 'Supprimer', value: tab.canDelete },
                              { key: 'canApprove', label: 'Approuver', value: tab.canApprove || false },
                              { key: 'canExport', label: 'Exporter', value: tab.canExport || false }
                            ].map(({ key, label, value }) => (
                              <Badge key={key} className={getActionColor(value)}>
                                {getActionIcon(key)}
                                <span className="ml-1">{label}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="profiles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRole.modules
                  .filter(module => module.profiles && module.profiles.length > 0)
                  .map((module) => (
                    <Card key={module.moduleId} className="border-purple-200">
                      <CardHeader className="bg-purple-50">
                        <CardTitle className="text-purple-800 text-sm">
                          Profils {module.moduleName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {module.profiles?.map((profile) => (
                          <div key={profile.profileId} className="bg-white p-3 rounded border">
                            <h6 className="font-medium mb-2">{profile.profileName}</h6>
                            <div className="flex gap-2">
                              <Badge className={getActionColor(profile.canView)}>
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Badge>
                              <Badge className={getActionColor(profile.canEdit)}>
                                <Edit className="h-3 w-3 mr-1" />
                                Modifier
                              </Badge>
                              <Badge className={getActionColor(profile.canAssign)}>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Assigner
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
