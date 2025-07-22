import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Calendar,
  Settings,
  Edit,
  MapPin,
  Phone,
  Clock
} from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useRBAC } from '../hooks/useRBAC';


export const ProfileViewer: React.FC = () => {
  const { user } = useAuth();
  const { getUserRole } = useRBAC();
  
  const currentRole = getUserRole();

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'super_admin': 'Super Administrateur',
      'admin_faculty': 'Administrateur Faculté',
      'dept_head': 'Chef de Département',
      'pedagogy_head': 'Responsable Pédagogique',
      'teacher': 'Enseignant',
      'admin_staff': 'Personnel Administratif',
      'vice_dean_pedagogy': 'Vice-Doyen de Pédagogie',
      'vice_dean_postgrad': 'Vice-Doyen des Études Supérieures',
      'domain_manager': 'Responsable du Domaine',
      'planning_service_head': 'Chef de Service des Programmation et Suivi',
      'budget_service_head': 'Chef de Service Budget et Finance',
      'secretary_general': 'Secrétaire Général',
      'accountant': 'Comptable',
      'custom_profile': 'Profil Mixte'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      'super_admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'admin_faculty': 'bg-red-100 text-red-800 border-red-200',
      'dept_head': 'bg-blue-100 text-blue-800 border-blue-200',
      'pedagogy_head': 'bg-green-100 text-green-800 border-green-200',
      'teacher': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'admin_staff': 'bg-gray-100 text-gray-800 border-gray-200',
      'vice_dean_pedagogy': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'vice_dean_postgrad': 'bg-teal-100 text-teal-800 border-teal-200',
      'domain_manager': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'planning_service_head': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'budget_service_head': 'bg-orange-100 text-orange-800 border-orange-200',
      'secretary_general': 'bg-pink-100 text-pink-800 border-pink-200',
      'accountant': 'bg-lime-100 text-lime-800 border-lime-200',
      'custom_profile': 'bg-violet-100 text-violet-800 border-violet-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Aucun utilisateur connecté</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête du profil */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">{user.name}</h1>
                  <p className="text-blue-700 text-lg">{getRoleDisplayName(user.role)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    {currentRole && (
                      <Badge variant="outline">
                        Niveau {currentRole.level}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Département</p>
                <p className="font-medium">Informatique</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Bureau</p>
                <p className="font-medium">Bureau 205, Bâtiment A</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="font-medium">+213 123 456 789</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informations de Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Dernière connexion</p>
                <p className="font-medium">Aujourd'hui à 14:30</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Membre depuis</p>
                <p className="font-medium">Septembre 2023</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Statut du compte</p>
                <Badge className="bg-green-100 text-green-800">Actif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions et accès */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissions et Accès
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentRole && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description du rôle</h4>
                <p className="text-gray-600 text-sm">{currentRole.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Modules accessibles</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentRole.modules.map((module) => (
                    <Badge key={module.moduleId} variant="outline" className="justify-center py-1">
                      {module.moduleName}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
