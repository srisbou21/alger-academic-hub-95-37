
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  Save
} from "lucide-react";
import { useRBAC } from '../../hooks/useRBAC';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  avatar?: string;
}

export const UserRoleAssignment: React.FC = () => {
  const { getUserRole } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const userRole = getUserRole();

  // Utilisateurs mockés pour la démonstration
  const mockUsers: User[] = [
    {
      id: 'user_1',
      name: 'Dr. Ahmed Benali',
      email: 'ahmed.benali@fsecsg.dz',
      role: 'teacher',
      department: 'Informatique',
      status: 'active',
      lastLogin: new Date('2024-01-15T10:30:00')
    },
    {
      id: 'user_2',
      name: 'Mme. Fatima Zahra',
      email: 'fatima.zahra@fsecsg.dz',
      role: 'dept_head',
      department: 'Informatique',
      status: 'active',
      lastLogin: new Date('2024-01-14T14:20:00')
    },
    {
      id: 'user_3',
      name: 'M. Karim Messaoudi',
      email: 'karim.messaoudi@fsecsg.dz',
      role: 'super_admin',
      department: 'Administration',
      status: 'active',
      lastLogin: new Date('2024-01-15T09:15:00')
    },
    {
      id: 'user_4',
      name: 'Dr. Amina Lounis',
      email: 'amina.lounis@fsecsg.dz',
      role: 'teacher',
      department: 'Mathématiques',
      status: 'active',
      lastLogin: new Date('2024-01-13T16:45:00')
    },
    {
      id: 'user_5',
      name: 'M. Omar Benhaddou',
      email: 'omar.benhaddou@fsecsg.dz',
      role: 'admin_staff',
      department: 'Administration',
      status: 'inactive'
    }
  ];

  const availableRoles = [
    { id: 'super_admin', name: 'Super Administrateur', level: 100 },
    { id: 'admin_faculty', name: 'Administrateur Faculté', level: 90 },
    { id: 'dept_head', name: 'Chef de Département', level: 80 },
    { id: 'pedagogy_head', name: 'Responsable Pédagogique', level: 70 },
    { id: 'teacher', name: 'Enseignant', level: 50 },
    { id: 'admin_staff', name: 'Personnel Administratif', level: 30 }
  ];

  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Administration'];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const getRoleInfo = (roleId: string) => {
    return availableRoles.find(role => role.id === roleId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-3 w-3" />;
      case 'inactive': return <UserX className="h-3 w-3" />;
      case 'suspended': return <AlertTriangle className="h-3 w-3" />;
      default: return <UserX className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs et Attribution des Rôles
          </CardTitle>
          <p className="text-blue-600">
            Gérez les utilisateurs du système et attribuez-leur des rôles appropriés
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Liste des Utilisateurs</TabsTrigger>
          <TabsTrigger value="assignment">Attribution de Rôles</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filtres et recherche */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    {availableRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Utilisateur
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarContent src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {user.department}
                            </Badge>
                            {roleInfo && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                {roleInfo.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">{user.status}</span>
                          </Badge>
                          {user.lastLogin && (
                            <p className="text-xs text-gray-500 mt-1">
                              Dernière connexion: {user.lastLogin.toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            Rôles
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Attribution de Rôles en Masse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Interface d'attribution de rôles en masse</p>
                <p className="text-sm mt-2">Cette fonctionnalité permettra d'attribuer des rôles à plusieurs utilisateurs en même temps</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
