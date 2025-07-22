import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Plus, 
  Save, 
  Trash2, 
  Edit,
  Shield,
  Eye,
  PenTool,
  CheckCircle,
  Download,
  X
} from "lucide-react";
import { SystemModule } from '../../types/rbac';

interface CustomProfile {
  id: string;
  name: string;
  description: string;
  level: number;
  modules: {
    [key in SystemModule]?: {
      canAccess: boolean;
      tabs: {
        [tabId: string]: {
          canView: boolean;
          canEdit: boolean;
          canDelete: boolean;
          canApprove: boolean;
          canExport: boolean;
        };
      };
    };
  };
}

export const CustomProfileManager: React.FC = () => {
  const [profiles, setProfiles] = useState<CustomProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CustomProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    level: 1
  });

  const modules = [
    { id: SystemModule.FACULTY, name: 'Faculté', tabs: ['overview', 'management', 'settings'] },
    { id: SystemModule.TEACHER, name: 'Enseignant', tabs: ['overview', 'grades', 'absences'] },
    { id: SystemModule.HR, name: 'GRH', tabs: ['overview', 'management', 'reports'] },
    { id: SystemModule.ADMIN, name: 'Administration', tabs: ['overview', 'budget', 'finance'] },
    { id: SystemModule.FORMATIONS, name: 'Formations', tabs: ['overview', 'management', 'validation'] },
    { id: SystemModule.RESERVATIONS, name: 'Réservations', tabs: ['overview', 'management', 'calendar'] },
    { id: SystemModule.STATISTICS, name: 'Statistiques', tabs: ['overview', 'reports', 'export'] },
    { id: SystemModule.TIMETABLE, name: 'Emploi du Temps', tabs: ['overview', 'planning', 'conflicts'] }
  ];

  const createNewProfile = () => {
    const newProfile: CustomProfile = {
      id: `custom_${Date.now()}`,
      name: editForm.name,
      description: editForm.description,
      level: editForm.level,
      modules: {}
    };
    
    setProfiles([...profiles, newProfile]);
    setSelectedProfile(newProfile);
    setIsEditing(false);
    setEditForm({ name: '', description: '', level: 1 });
  };

  const updateModuleAccess = (moduleId: SystemModule, canAccess: boolean) => {
    if (!selectedProfile) return;
    
    const updatedProfile = {
      ...selectedProfile,
      modules: {
        ...selectedProfile.modules,
        [moduleId]: canAccess ? { 
          canAccess: true, 
          tabs: {} 
        } : undefined
      }
    };
    
    setSelectedProfile(updatedProfile);
    setProfiles(profiles.map(p => p.id === selectedProfile.id ? updatedProfile : p));
  };

  const updateTabPermission = (moduleId: SystemModule, tabId: string, permission: string, value: boolean) => {
    if (!selectedProfile) return;
    
    const moduleAccess = selectedProfile.modules[moduleId];
    if (!moduleAccess) return;
    
    const updatedProfile = {
      ...selectedProfile,
      modules: {
        ...selectedProfile.modules,
        [moduleId]: {
          ...moduleAccess,
          tabs: {
            ...moduleAccess.tabs,
            [tabId]: {
              ...moduleAccess.tabs[tabId],
              [permission]: value
            }
          }
        }
      }
    };
    
    setSelectedProfile(updatedProfile);
    setProfiles(profiles.map(p => p.id === selectedProfile.id ? updatedProfile : p));
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'canView': return <Eye className="h-3 w-3" />;
      case 'canEdit': return <PenTool className="h-3 w-3" />;
      case 'canDelete': return <Trash2 className="h-3 w-3" />;
      case 'canApprove': return <CheckCircle className="h-3 w-3" />;
      case 'canExport': return <Download className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'canView': return 'Lecture';
      case 'canEdit': return 'Modification';
      case 'canDelete': return 'Suppression';
      case 'canApprove': return 'Approbation';
      case 'canExport': return 'Export';
      default: return permission;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Settings className="h-5 w-5" />
            Gestionnaire de Profils Mixtes
          </CardTitle>
          <p className="text-purple-600">
            Créez et configurez des profils personnalisés avec des permissions sur mesure
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profiles">Profils Existants</TabsTrigger>
          <TabsTrigger value="create">Créer un Profil</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card key={profile.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <Badge variant="outline">Niveau {profile.level}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{profile.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Modules autorisés:</strong> {Object.keys(profile.modules).length}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedProfile(profile)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Configurer
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setProfiles(profiles.filter(p => p.id !== profile.id))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {profiles.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun profil mixte créé</p>
                  <p className="text-sm mt-2">Commencez par créer votre premier profil personnalisé</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Créer un Nouveau Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nom du Profil</Label>
                  <Input
                    id="profile-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Ex: Responsable Spécialisé"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-level">Niveau hiérarchique</Label>
                  <Input
                    id="profile-level"
                    type="number"
                    min="1"
                    max="99"
                    value={editForm.level}
                    onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-description">Description</Label>
                <Textarea
                  id="profile-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Décrivez les responsabilités de ce profil..."
                />
              </div>
              <Button 
                onClick={createNewProfile}
                disabled={!editForm.name.trim()}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Créer le Profil
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration des permissions */}
      {selectedProfile && (
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuration: {selectedProfile.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProfile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modules.map((module) => {
                const moduleAccess = selectedProfile.modules[module.id];
                
                return (
                  <Card key={module.id} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Switch
                          checked={!!moduleAccess?.canAccess}
                          onCheckedChange={(checked) => updateModuleAccess(module.id, checked)}
                        />
                      </div>
                    </CardHeader>
                    
                    {moduleAccess?.canAccess && (
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {module.tabs.map((tabId) => (
                            <div key={tabId} className="border rounded-lg p-4">
                              <h5 className="font-medium mb-3 capitalize">{tabId}</h5>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {['canView', 'canEdit', 'canDelete', 'canApprove', 'canExport'].map((permission) => (
                                  <div key={permission} className="flex items-center space-x-2">
                                    {getPermissionIcon(permission)}
                                    <Switch
                                      checked={!!moduleAccess.tabs[tabId]?.[permission]}
                                      onCheckedChange={(checked) => 
                                        updateTabPermission(module.id, tabId, permission, checked)
                                      }
                                    />
                                    <span className="text-sm">{getPermissionLabel(permission)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};