
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Building,
  UserCheck
} from "lucide-react";

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const users = [
    {
      id: "1",
      name: "Dr. Ahmed Benali",
      email: "ahmed.benali@univ.fr",
      phone: "+213 555 123 456",
      role: "teacher",
      department: "Informatique",
      status: "active",
      lastLogin: "2024-06-15",
      permissions: [
        { resource: "reservations", actions: ["create", "read"] },
        { resource: "spaces", actions: ["read"] }
      ]
    },
    {
      id: "2",
      name: "Mme. Sarah Amari",
      email: "sarah.amari@univ.fr",
      phone: "+213 555 234 567",
      role: "admin_faculty",
      department: "Administration",
      status: "active",
      lastLogin: "2024-06-16",
      permissions: [
        { resource: "reservations", actions: ["create", "read", "update", "validate"] },
        { resource: "spaces", actions: ["create", "read", "update"] },
        { resource: "users", actions: ["read", "update"] }
      ]
    },
    {
      id: "3",
      name: "M. Karim Mansouri",
      email: "karim.mansouri@univ.fr",
      phone: "+213 555 345 678",
      role: "student",
      department: "Informatique L3",
      status: "active",
      lastLogin: "2024-06-14",
      permissions: [
        { resource: "reservations", actions: ["read"] },
        { resource: "spaces", actions: ["read"] }
      ]
    },
    {
      id: "4",
      name: "Dr. Fatima Belkacem",
      email: "fatima.belkacem@univ.fr",
      phone: "+213 555 456 789",
      role: "teacher",
      department: "Mathématiques",
      status: "inactive",
      lastLogin: "2024-06-10",
      permissions: [
        { resource: "reservations", actions: ["create", "read"] },
        { resource: "spaces", actions: ["read"] }
      ]
    },
    {
      id: "5",
      name: "M. Omar Chekroun",
      email: "omar.chekroun@univ.fr",
      phone: "+213 555 567 890",
      role: "admin_system",
      department: "IT",
      status: "active",
      lastLogin: "2024-06-16",
      permissions: [
        { resource: "reservations", actions: ["create", "read", "update", "delete", "validate"] },
        { resource: "spaces", actions: ["create", "read", "update", "delete"] },
        { resource: "users", actions: ["create", "read", "update", "delete"] },
        { resource: "system", actions: ["all"] }
      ]
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin_system": return "bg-red-100 text-red-800 border-red-200";
      case "admin_faculty": return "bg-purple-100 text-purple-800 border-purple-200";
      case "teacher": return "bg-blue-100 text-blue-800 border-blue-200";
      case "student": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin_system": return "Admin Système";
      case "admin_faculty": return "Admin Faculté";
      case "teacher": return "Enseignant";
      case "student": return "Étudiant";
      default: return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-red-100 text-red-800 border-red-200";
      case "suspended": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Actif";
      case "inactive": return "Inactif";
      case "suspended": return "Suspendu";
      default: return status;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getPermissionCount = (permissions: any[]) => {
    return permissions.reduce((total, perm) => total + perm.actions.length, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des Utilisateurs
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Gérez les utilisateurs et leurs permissions d'accès
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin_system">Admin Système</SelectItem>
                <SelectItem value="admin_faculty">Admin Faculté</SelectItem>
                <SelectItem value="teacher">Enseignant</SelectItem>
                <SelectItem value="student">Étudiant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-800">{users.length}</p>
                <p className="text-sm text-blue-600">Total utilisateurs</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 text-center">
                <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-800">{users.filter(u => u.status === 'active').length}</p>
                <p className="text-sm text-green-600">Actifs</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-purple-800">{users.filter(u => u.role.includes('admin')).length}</p>
                <p className="text-sm text-purple-600">Administrateurs</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4 text-center">
                <Building className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-800">{users.filter(u => u.role === 'teacher').length}</p>
                <p className="text-sm text-blue-600">Enseignants</p>
              </CardContent>
            </Card>
          </div>

          {/* Table des utilisateurs */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-600">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-600">{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">{user.department}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {getPermissionCount(user.permissions)} permissions
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
