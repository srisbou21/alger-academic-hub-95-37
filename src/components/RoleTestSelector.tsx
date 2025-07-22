
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  GraduationCap, 
  Building, 
  Users, 
  Shield,
  Crown,
  UserCheck,
  FileText,
  Calculator,
  Calendar,
  Briefcase
} from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TestRole {
  id: string;
  name: string;
  email: string;
  displayName: string;
  description: string;
  level: number;
  icon: React.ReactNode;
  color: string;
}

export const RoleTestSelector: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const testRoles: TestRole[] = [
    {
      id: 'super_admin',
      name: 'M. Karim Messaoudi',
      email: 'admin@fsecsg.dz',
      displayName: 'Super Administrateur',
      description: 'Accès complet à toutes les fonctionnalités du système',
      level: 100,
      icon: <Crown className="h-5 w-5" />,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'admin_faculty',
      name: 'Dr. Ahmed Benali',
      email: 'doyen@fsecsg.dz',
      displayName: 'Administrateur Faculté',
      description: 'Gestion complète de la faculté',
      level: 90,
      icon: <Building className="h-5 w-5" />,
      color: 'from-red-500 to-red-700'
    },
    {
      id: 'dept_head',
      name: 'Mme. Fatima Zahra',
      email: 'chef@fsecsg.dz',
      displayName: 'Chef de Département',
      description: 'Gestion du département informatique',
      level: 80,
      icon: <Users className="h-5 w-5" />,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'vice_dean_pedagogy',
      name: 'Dr. Youcef Mammeri',
      email: 'vice.pedagogie@fsecsg.dz',
      displayName: 'Vice-Doyen Pédagogie',
      description: 'Gestion pédagogique de la faculté',
      level: 85,
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'from-emerald-500 to-emerald-700'
    },
    {
      id: 'vice_dean_postgrad',
      name: 'Dr. Amina Khelil',
      email: 'vice.etudes@fsecsg.dz',
      displayName: 'Vice-Doyen Études Sup.',
      description: 'Gestion des études supérieures',
      level: 85,
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'from-teal-500 to-teal-700'
    },
    {
      id: 'domain_manager',
      name: 'Dr. Said Benaissa',
      email: 'domaine@fsecsg.dz',
      displayName: 'Responsable Domaine',
      description: 'Gestion du domaine de formation',
      level: 75,
      icon: <Shield className="h-5 w-5" />,
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      id: 'planning_service_head',
      name: 'M. Omar Belkacem',
      email: 'planning@fsecsg.dz',
      displayName: 'Chef Service Planning',
      description: 'Programmation et suivi académique',
      level: 70,
      icon: <Calendar className="h-5 w-5" />,
      color: 'from-cyan-500 to-cyan-700'
    },
    {
      id: 'budget_service_head',
      name: 'Mme. Nadia Hamdi',
      email: 'budget@fsecsg.dz',
      displayName: 'Chef Service Budget',
      description: 'Gestion budget et finance',
      level: 70,
      icon: <Calculator className="h-5 w-5" />,
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'secretary_general',
      name: 'M. Mohamed Tabet',
      email: 'secretaire@fsecsg.dz',
      displayName: 'Secrétaire Général',
      description: 'Administration générale',
      level: 80,
      icon: <FileText className="h-5 w-5" />,
      color: 'from-pink-500 to-pink-700'
    },
    {
      id: 'accountant',
      name: 'Mme. Salima Cherif',
      email: 'comptable@fsecsg.dz',
      displayName: 'Comptable',
      description: 'Gestion comptable et financière',
      level: 60,
      icon: <Calculator className="h-5 w-5" />,
      color: 'from-lime-500 to-lime-700'
    },
    {
      id: 'teacher',
      name: 'Dr. Rachid Bensalem',
      email: 'enseignant@fsecsg.dz',
      displayName: 'Enseignant',
      description: 'Enseignement et suivi pédagogique',
      level: 50,
      icon: <User className="h-5 w-5" />,
      color: 'from-yellow-500 to-yellow-700'
    },
    {
      id: 'admin_staff',
      name: 'M. Ali Bouzid',
      email: 'personnel@fsecsg.dz',
      displayName: 'Personnel Administratif',
      description: 'Support administratif',
      level: 40,
      icon: <Briefcase className="h-5 w-5" />,
      color: 'from-gray-500 to-gray-700'
    }
  ];

  const handleRoleSelect = async (role: TestRole) => {
    console.log('Tentative de connexion avec le rôle:', role.displayName);
    try {
      const success = await login(role.email, "test123");
      if (success) {
        console.log('Connexion réussie, redirection vers le dashboard...');
        navigate('/');
      } else {
        console.error('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Sélecteur de Rôles - Tests
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sélectionnez un rôle pour tester les permissions et accès dans le système
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testRoles.map((role) => (
            <Card key={role.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${role.color} text-white`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{role.displayName}</h4>
                    <p className="text-xs text-muted-foreground">{role.name}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Niv. {role.level}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {role.description}
                </p>
                
                <Button 
                  onClick={() => handleRoleSelect(role)}
                  size="sm" 
                  className="w-full"
                  variant="outline"
                >
                  <UserCheck className="h-3 w-3 mr-2" />
                  Tester ce rôle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
