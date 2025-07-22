
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Download, 
  Upload, 
  Settings,
  UserCheck,
  UserX,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileText,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRBAC } from "../../hooks/useRBAC";
import { SystemModule, PermissionAction } from "../../types/rbac";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin_faculty' | 'dept_head' | 'pedagogy_head' | 'teacher' | 'admin_staff' | 
        'vice_dean_pedagogy' | 'vice_dean_postgrad' | 'domain_manager' | 'planning_service_head' | 
        'budget_service_head' | 'secretary_general' | 'accountant' | 'custom_profile';
  department: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  employeeId?: string;
  profilePicture?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "M. Karim Messaoudi",
    email: "karim.messaoudi@fsecsg.dz",
    role: "super_admin",
    department: "Administration",
    permissions: ["all"],
    status: "active",
    lastLogin: new Date('2024-01-15T10:30:00'),
    createdAt: new Date('2023-01-15'),
    phone: "+213 555 123 456",
    address: "Alger, Algérie",
    dateOfBirth: new Date('1975-05-15'),
    employeeId: "EMP001"
  },
  {
    id: "2",
    name: "Dr. Ahmed Benali",
    email: "ahmed.benali@fsecsg.dz",
    role: "admin_faculty",
    department: "Sciences",
    permissions: ["view_all", "reports", "user_management"],
    status: "active",
    lastLogin: new Date('2024-01-14T14:20:00'),
    createdAt: new Date('2023-02-10'),
    phone: "+213 555 234 567",
    address: "Constantine, Algérie",
    dateOfBirth: new Date('1970-03-20'),
    employeeId: "EMP002"
  },
  {
    id: "3",
    name: "Mme. Fatima Zahra",
    email: "fatima.zahra@fsecsg.dz",
    role: "dept_head",
    department: "Informatique",
    permissions: ["view_department", "reports_dept"],
    status: "active",
    lastLogin: new Date('2024-01-13T16:45:00'),
    createdAt: new Date('2023-03-05'),
    phone: "+213 555 345 678",
    address: "Annaba, Algérie",
    dateOfBirth: new Date('1980-07-10'),
    employeeId: "EMP003"
  },
  {
    id: "4",
    name: "Dr. Youcef Mammeri",
    email: "youcef.mammeri@fsecsg.dz",
    role: "vice_dean_pedagogy",
    department: "Vice-Décanat Pédagogie",
    permissions: ["view_pedagogy", "manage_pedagogy"],
    status: "active",
    lastLogin: new Date('2024-01-12T09:30:00'),
    createdAt: new Date('2023-04-01'),
    phone: "+213 555 456 789",
    address: "Sétif, Algérie",
    dateOfBirth: new Date('1978-11-25'),
    employeeId: "EMP004"
  },
  {
    id: "5",
    name: "Dr. Amina Khelil",
    email: "amina.khelil@fsecsg.dz",
    role: "vice_dean_postgrad",
    department: "Vice-Décanat Études Supérieures",
    permissions: ["view_postgrad", "manage_postgrad"],
    status: "active",
    lastLogin: new Date('2024-01-11T11:15:00'),
    createdAt: new Date('2023-04-15'),
    phone: "+213 555 567 890",
    address: "Oran, Algérie",
    dateOfBirth: new Date('1982-01-30'),
    employeeId: "EMP005"
  },
  {
    id: "6",
    name: "Dr. Said Benaissa",
    email: "said.benaissa@fsecsg.dz",
    role: "domain_manager",
    department: "Domaine ST",
    permissions: ["view_domain", "manage_domain"],
    status: "active",
    lastLogin: new Date('2024-01-10T13:45:00'),
    createdAt: new Date('2023-05-01'),
    phone: "+213 555 678 901",
    address: "Tlemcen, Algérie",
    dateOfBirth: new Date('1976-09-12'),
    employeeId: "EMP006"
  },
  {
    id: "7",
    name: "M. Omar Belkacem",
    email: "omar.belkacem@fsecsg.dz",
    role: "planning_service_head",
    department: "Service Planning",
    permissions: ["manage_planning", "view_schedules"],
    status: "active",
    lastLogin: new Date('2024-01-09T15:20:00'),
    createdAt: new Date('2023-05-15'),
    phone: "+213 555 789 012",
    address: "Béjaïa, Algérie",
    dateOfBirth: new Date('1983-04-08'),
    employeeId: "EMP007"
  },
  {
    id: "8",
    name: "Mme. Nadia Hamdi",
    email: "nadia.hamdi@fsecsg.dz",
    role: "budget_service_head",
    department: "Service Budget",
    permissions: ["manage_budget", "view_finances"],
    status: "active",
    lastLogin: new Date('2024-01-08T08:30:00'),
    createdAt: new Date('2023-06-01'),
    phone: "+213 555 890 123",
    address: "Blida, Algérie",
    dateOfBirth: new Date('1981-12-05'),
    employeeId: "EMP008"
  },
  {
    id: "9",
    name: "M. Mohamed Tabet",
    email: "mohamed.tabet@fsecsg.dz",
    role: "secretary_general",
    department: "Secrétariat Général",
    permissions: ["manage_administration", "view_all_services"],
    status: "active",
    lastLogin: new Date('2024-01-07T10:15:00'),
    createdAt: new Date('2023-06-15'),
    phone: "+213 555 901 234",
    address: "Médéa, Algérie",
    dateOfBirth: new Date('1979-06-18'),
    employeeId: "EMP009"
  },
  {
    id: "10",
    name: "Mme. Salima Cherif",
    email: "salima.cherif@fsecsg.dz",
    role: "accountant",
    department: "Comptabilité",
    permissions: ["manage_accounting", "view_financial_reports"],
    status: "active",
    lastLogin: new Date('2024-01-06T14:45:00'),
    createdAt: new Date('2023-07-01'),
    phone: "+213 555 012 345",
    address: "Bouira, Algérie",
    dateOfBirth: new Date('1984-02-22'),
    employeeId: "EMP010"
  },
  {
    id: "11",
    name: "M. Ali Bouzid",
    email: "ali.bouzid@fsecsg.dz",
    role: "admin_staff",
    department: "Personnel Administratif",
    permissions: ["basic_access"],
    status: "active",
    lastLogin: new Date('2024-01-05T09:00:00'),
    createdAt: new Date('2023-07-15'),
    phone: "+213 555 123 456",
    address: "Jijel, Algérie",
    dateOfBirth: new Date('1985-08-14'),
    employeeId: "EMP011"
  },
  {
    id: "12",
    name: "Dr. Leila Amrani",
    email: "leila.amrani@fsecsg.dz",
    role: "teacher",
    department: "Informatique",
    permissions: ["teaching_access"],
    status: "suspended",
    lastLogin: new Date('2024-01-04T12:30:00'),
    createdAt: new Date('2023-08-01'),
    phone: "+213 555 234 567",
    address: "Mostaganem, Algérie",
    dateOfBirth: new Date('1977-10-03'),
    employeeId: "EMP012"
  },
  {
    id: "13",
    name: "M. Rachid Khelifi",
    email: "rachid.khelifi@fsecsg.dz",
    role: "teacher",
    department: "Mathématiques",
    permissions: ["teaching_access"],
    status: "inactive",
    createdAt: new Date('2023-08-15'),
    phone: "+213 555 345 678",
    address: "Chlef, Algérie",
    dateOfBirth: new Date('1972-12-28'),
    employeeId: "EMP013"
  }
];

const availableRoles = [
  { id: 'super_admin', name: 'Super Administrateur', level: 100, description: 'Accès complet au système' },
  { id: 'admin_faculty', name: 'Administrateur Faculté', level: 90, description: 'Gestion de la faculté' },
  { id: 'dept_head', name: 'Chef de Département', level: 80, description: 'Gestion du département' },
  { id: 'vice_dean_pedagogy', name: 'Vice-Doyen Pédagogie', level: 85, description: 'Gestion pédagogique' },
  { id: 'vice_dean_postgrad', name: 'Vice-Doyen Études Supérieures', level: 85, description: 'Gestion études supérieures' },
  { id: 'domain_manager', name: 'Responsable Domaine', level: 75, description: 'Gestion de domaine' },
  { id: 'planning_service_head', name: 'Chef Service Planning', level: 70, description: 'Gestion planning' },
  { id: 'budget_service_head', name: 'Chef Service Budget', level: 70, description: 'Gestion budget' },
  { id: 'secretary_general', name: 'Secrétaire Général', level: 80, description: 'Gestion administrative' },
  { id: 'accountant', name: 'Comptable', level: 60, description: 'Gestion comptable' },
  { id: 'pedagogy_head', name: 'Responsable Pédagogique', level: 70, description: 'Gestion pédagogique' },
  { id: 'teacher', name: 'Enseignant', level: 50, description: 'Enseignement' },
  { id: 'admin_staff', name: 'Personnel Administratif', level: 30, description: 'Support administratif' },
  { id: 'custom_profile', name: 'Profil Personnalisé', level: 40, description: 'Profil avec permissions spécifiques' }
];

const departments = [
  'Administration', 'Sciences', 'Informatique', 'Mathématiques', 'Physique', 
  'Vice-Décanat Pédagogie', 'Vice-Décanat Études Supérieures', 'Domaine ST',
  'Service Planning', 'Service Budget', 'Secrétariat Général', 'Comptabilité',
  'Personnel Administratif'
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    address: '',
    employeeId: ''
  });
  const { toast } = useToast();
  const { hasPermission } = useRBAC();

  // Fonctions utilitaires
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

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={getStatusColor(status)}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">
          {status === 'active' ? 'Actif' : status === 'inactive' ? 'Inactif' : 'Suspendu'}
        </span>
      </Badge>
    );
  };

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    departments: [...new Set(users.map(u => u.department))].length,
    roles: [...new Set(users.map(u => u.role))].length
  };

  // Fonctions de gestion
  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: `user_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      department: newUser.department,
      phone: newUser.phone,
      address: newUser.address,
      employeeId: newUser.employeeId || `EMP${Date.now()}`,
      permissions: [],
      status: 'active',
      createdAt: new Date()
    };

    setUsers(prev => [user, ...prev]);
    setIsCreateDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: '',
      department: '',
      phone: '',
      address: '',
      employeeId: ''
    });

    toast({
      title: "Utilisateur créé",
      description: "Le nouvel utilisateur a été créé avec succès",
    });
  };

  const handleUpdateUserStatus = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    
    toast({
      title: "Statut mis à jour",
      description: `Le statut de l'utilisateur a été mis à jour`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès",
    });
  };

  const handleExportUsers = () => {
    const csvContent = [
      ['Nom', 'Email', 'Rôle', 'Département', 'Statut', 'Dernière connexion', 'Téléphone', 'ID Employé'].join(','),
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        getRoleInfo(user.role)?.name || user.role,
        user.department,
        user.status,
        user.lastLogin ? user.lastLogin.toLocaleDateString('fr-FR') : 'Jamais',
        user.phone || '',
        user.employeeId || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: "La liste des utilisateurs a été exportée",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs et Accès
          </CardTitle>
          <p className="text-purple-600">
            Gérez les utilisateurs, leurs rôles et permissions dans le système
          </p>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
            <p className="text-xs text-blue-700">Total</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-800">{stats.active}</p>
            <p className="text-xs text-green-700">Actifs</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-4 text-center">
            <UserX className="h-6 w-6 text-gray-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-800">{stats.inactive}</p>
            <p className="text-xs text-gray-700">Inactifs</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-800">{stats.suspended}</p>
            <p className="text-xs text-red-700">Suspendus</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-orange-800">{stats.departments}</p>
            <p className="text-xs text-orange-700">Départements</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-purple-800">{stats.roles}</p>
            <p className="text-xs text-purple-700">Rôles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Liste des Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Gestion des Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Filtres et Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres et Actions
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleExportUsers} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Nouvel Utilisateur
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                              id="name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                              placeholder="Dr. Ahmed Benali"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                              placeholder="ahmed.benali@fsecsg.dz"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="role">Rôle *</Label>
                            <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles.map(role => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="department">Département *</Label>
                            <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un département" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map(dept => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                              id="phone"
                              value={newUser.phone}
                              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                              placeholder="+213 555 123 456"
                            />
                          </div>
                          <div>
                            <Label htmlFor="employeeId">ID Employé</Label>
                            <Input
                              id="employeeId"
                              value={newUser.employeeId}
                              onChange={(e) => setNewUser({...newUser, employeeId: e.target.value})}
                              placeholder="EMP001"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="address">Adresse</Label>
                          <Textarea
                            id="address"
                            value={newUser.address}
                            onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                            placeholder="Alger, Algérie"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleCreateUser} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Créer l'utilisateur
                          </Button>
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email, ID..."
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

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("all");
                  setSelectedRole("all");
                  setSelectedStatus("all");
                }}>
                  Réinitialiser
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.employeeId && (
                              <p className="text-xs text-gray-400">ID: {user.employeeId}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            <Shield className="h-3 w-3 mr-1" />
                            {roleInfo?.name || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.department}</Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user.status)}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? (
                            <div>
                              <p className="text-sm">{user.lastLogin.toLocaleDateString('fr-FR')}</p>
                              <p className="text-xs text-gray-500">{user.lastLogin.toLocaleTimeString('fr-FR')}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">Jamais</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => { setSelectedUser(user); setIsViewDialogOpen(true); }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => { setSelectedUser(user); setIsEditDialogOpen(true); }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => { setSelectedUser(user); setIsPermissionsDialogOpen(true); }}
                            >
                              <Shield className="h-3 w-3" />
                            </Button>
                            <Select 
                              value={user.status} 
                              onValueChange={(value: 'active' | 'inactive' | 'suspended') => handleUpdateUserStatus(user.id, value)}
                            >
                              <SelectTrigger className="w-8 h-8 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Activer</SelectItem>
                                <SelectItem value="inactive">Désactiver</SelectItem>
                                <SelectItem value="suspended">Suspendre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Rôles</CardTitle>
              <p className="text-sm text-gray-600">
                Gérez les rôles disponibles dans le système et leurs permissions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableRoles.map((role) => (
                  <Card key={role.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          Niveau {role.level}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                      <h3 className="font-semibold mb-1">{role.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                      <div className="text-xs text-gray-500">
                        {users.filter(u => u.role === role.id).length} utilisateur(s)
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Permissions</CardTitle>
              <p className="text-sm text-gray-600">
                Configurez les permissions pour chaque rôle
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Interface de gestion des permissions</p>
                <p className="text-sm mt-2">Cette section permettra de configurer les permissions détaillées pour chaque rôle</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de vue détaillée */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'Utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nom complet</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rôle</Label>
                  <div className="mt-1">
                    <Badge className="bg-purple-100 text-purple-800">
                      {getRoleInfo(selectedUser.role)?.name || selectedUser.role}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Département</Label>
                  <p>{selectedUser.department}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Statut</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                <div>
                  <Label>ID Employé</Label>
                  <p>{selectedUser.employeeId || 'N/A'}</p>
                </div>
              </div>
              {selectedUser.phone && (
                <div>
                  <Label>Téléphone</Label>
                  <p>{selectedUser.phone}</p>
                </div>
              )}
              {selectedUser.address && (
                <div>
                  <Label>Adresse</Label>
                  <p>{selectedUser.address}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date de création</Label>
                  <p>{selectedUser.createdAt.toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label>Dernière connexion</Label>
                  <p>{selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleDateString('fr-FR') : 'Jamais'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
