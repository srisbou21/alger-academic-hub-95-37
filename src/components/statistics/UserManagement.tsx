
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Shield, Search, Settings } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_faculty' | 'dept_head' | 'pedagogy_head' | 'teacher' | 'admin_staff';
  department: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Benali",
    email: "a.benali@univ.dz",
    role: "super_admin",
    department: "Administration",
    permissions: ["all"],
    status: "active",
    lastLogin: new Date()
  },
  {
    id: "2",
    name: "Fatima Kaci",
    email: "f.kaci@univ.dz",
    role: "admin_faculty",
    department: "Sciences",
    permissions: ["view_all", "reports", "user_management"],
    status: "active",
    lastLogin: new Date()
  },
  {
    id: "3",
    name: "Mohamed Saidi",
    email: "m.saidi@univ.dz",
    role: "dept_head",
    department: "Informatique",
    permissions: ["view_department", "reports_dept"],
    status: "active",
    lastLogin: new Date()
  }
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const getRoleText = (role: string) => {
    const roles = {
      'super_admin': 'Super Administrateur',
      'admin_faculty': 'Admin Faculté',
      'dept_head': 'Chef Département',
      'pedagogy_head': 'Resp. Pédagogique',
      'teacher': 'Enseignant',
      'admin_staff': 'Personnel Admin'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'super_admin': 'bg-purple-100 text-purple-800',
      'admin_faculty': 'bg-red-100 text-red-800',
      'dept_head': 'bg-blue-100 text-blue-800',
      'pedagogy_head': 'bg-green-100 text-green-800',
      'teacher': 'bg-yellow-100 text-yellow-800',
      'admin_staff': 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <Card className="border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des Utilisateurs et Accès
            </CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin_faculty">Admin Faculté</SelectItem>
                <SelectItem value="dept_head">Chef Département</SelectItem>
                <SelectItem value="teacher">Enseignant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.department}</p>
                    </div>
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <Badge className={getRoleColor(user.role)} variant="outline">
                    {getRoleText(user.role)}
                  </Badge>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      <Shield className="h-3 w-3 mr-1" />
                      Permissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
