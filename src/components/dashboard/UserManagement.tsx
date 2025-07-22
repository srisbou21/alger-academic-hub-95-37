import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Building,
  UserCheck,
  UserX,
  Download,
  Upload
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  departement: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  dateCreation: Date;
  derniereConnexion?: Date;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Données simulées
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        nom: 'Benali',
        prenom: 'Ahmed',
        email: 'doyen@fsecsg.dz',
        telephone: '+213 555 123 456',
        role: 'admin_faculty',
        departement: 'Administration',
        statut: 'actif',
        dateCreation: new Date('2023-01-15'),
        derniereConnexion: new Date('2024-01-15')
      },
      {
        id: '2',
        nom: 'Messaoudi',
        prenom: 'Karim',
        email: 'admin@fsecsg.dz',
        telephone: '+213 555 123 457',
        role: 'super_admin',
        departement: 'Administration',
        statut: 'actif',
        dateCreation: new Date('2023-01-10'),
        derniereConnexion: new Date('2024-01-15')
      },
      {
        id: '3',
        nom: 'Zahra',
        prenom: 'Fatima',
        email: 'chef@fsecsg.dz',
        telephone: '+213 555 123 458',
        role: 'dept_head',
        departement: 'Sciences Économiques',
        statut: 'actif',
        dateCreation: new Date('2023-02-01'),
        derniereConnexion: new Date('2024-01-14')
      },
      {
        id: '4',
        nom: 'Benaissa',
        prenom: 'Mohamed',
        email: 'enseignant@fsecsg.dz',
        telephone: '+213 555 123 459',
        role: 'teacher',
        departement: 'Sciences Commerciales',
        statut: 'actif',
        dateCreation: new Date('2023-03-01'),
        derniereConnexion: new Date('2024-01-13')
      },
      {
        id: '5',
        nom: 'Hamdi',
        prenom: 'Nadia',
        email: 'personnel@fsecsg.dz',
        telephone: '+213 555 123 460',
        role: 'admin_staff',
        departement: 'Administration',
        statut: 'inactif',
        dateCreation: new Date('2023-04-01'),
        derniereConnexion: new Date('2024-01-10')
      }
    ];
    setUsers(mockUsers);
  }, []);

  const roles = [
    { value: 'super_admin', label: 'Super Administrateur', color: 'bg-red-100 text-red-800' },
    { value: 'admin_faculty', label: 'Doyen', color: 'bg-purple-100 text-purple-800' },
    { value: 'dept_head', label: 'Chef de Département', color: 'bg-blue-100 text-blue-800' },
    { value: 'teacher', label: 'Enseignant', color: 'bg-green-100 text-green-800' },
    { value: 'admin_staff', label: 'Personnel Administratif', color: 'bg-orange-100 text-orange-800' }
  ];

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      case 'suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.statut === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = async (userId: string, newStatus: 'actif' | 'inactif' | 'suspendu') => {
    setLoading(true);
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, statut: newStatus } : user
      ));
      
      toast({
        title: "Statut modifié",
        description: `Le statut de l'utilisateur a été mis à jour vers "${newStatus}".`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    setLoading(true);
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportUsers = () => {
    const csv = [
      ['Nom', 'Prénom', 'Email', 'Rôle', 'Département', 'Statut'],
      ...filteredUsers.map(user => [
        user.nom,
        user.prenom,
        user.email,
        getRoleInfo(user.role).label,
        user.departement,
        user.statut
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilisateurs.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>Gestion des utilisateurs</span>
              </CardTitle>
              <CardDescription>
                Gérez les comptes utilisateurs et leurs permissions
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={exportUsers} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                    <DialogDescription>
                      Ajoutez un nouveau membre à la plateforme FSECSG
                    </DialogDescription>
                  </DialogHeader>
                  {/* Formulaire de création d'utilisateur */}
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" placeholder="Nom de famille" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" placeholder="Prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@fsecsg.dz" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input id="telephone" placeholder="+213 XXX XXX XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rôle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departement">Département</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administration</SelectItem>
                          <SelectItem value="eco">Sciences Économiques</SelectItem>
                          <SelectItem value="comm">Sciences Commerciales</SelectItem>
                          <SelectItem value="gestion">Sciences de Gestion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button onClick={() => setShowCreateDialog(false)}>
                      Créer l'utilisateur
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-500">Total utilisateurs</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.statut === 'actif').length}</p>
                  <p className="text-sm text-gray-500">Actifs</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-8 w-8 text-gray-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.statut === 'inactif').length}</p>
                  <p className="text-sm text-gray-500">Inactifs</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.statut === 'suspendu').length}</p>
                  <p className="text-sm text-gray-500">Suspendus</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.prenom} {user.nom}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.telephone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{user.telephone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleInfo(user.role).color}>
                        {getRoleInfo(user.role).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{user.departement}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.statut)}>
                        {user.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.derniereConnexion ? (
                        <div className="text-sm">
                          {user.derniereConnexion.toLocaleDateString('fr-FR')}
                        </div>
                      ) : (
                        <span className="text-gray-400">Jamais</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, user.statut === 'actif' ? 'inactif' : 'actif')}
                          >
                            {user.statut === 'actif' ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};