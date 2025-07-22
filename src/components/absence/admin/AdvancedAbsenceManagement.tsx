
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Filter, Users, Download, Search, TrendingUp } from "lucide-react";
import { User as UserType } from "../../../types/user";
import { AbsencePermissions } from "../../../services/permissionService";
import { TeacherAbsence } from "../../../types/teacher";
import { absenceService, AbsenceFilters } from "../../../services/absenceService";
import { useToast } from "@/hooks/use-toast";

interface AdvancedAbsenceManagementProps {
  currentUser: UserType;
  permissions: AbsencePermissions;
}

export const AdvancedAbsenceManagement: React.FC<AdvancedAbsenceManagementProps> = ({
  currentUser,
  permissions
}) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [filteredAbsences, setFilteredAbsences] = useState<TeacherAbsence[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AbsenceFilters>({});
  const { toast } = useToast();

  // Options pour les filtres
  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie'];
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  const semesters = ['S1', 'S2'];
  const absenceTypes = [
    { value: 'maladie', label: 'Maladie' },
    { value: 'conge_annuel', label: 'Congé annuel' },
    { value: 'formation', label: 'Formation' },
    { value: 'mission', label: 'Mission' },
    { value: 'autre', label: 'Autre' }
  ];

  const mockTeachers = [
    { id: 'teacher_1', name: 'Dr. Ahmed Benali', department: 'Informatique' },
    { id: 'teacher_2', name: 'Dr. Fatima Kaci', department: 'Mathématiques' },
    { id: 'teacher_3', name: 'Dr. Mohamed Saidi', department: 'Physique' },
    { id: 'teacher_4', name: 'Dr. Aicha Mammeri', department: 'Informatique' },
    { id: 'teacher_5', name: 'Dr. Omar Belkacem', department: 'Chimie' }
  ];

  useEffect(() => {
    loadAbsences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [absences, filters]);

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
    } catch (error) {
      console.error("Erreur lors du chargement des absences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les absences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...absences];

    if (filters.teacherId) {
      filtered = filtered.filter(abs => abs.teacherId === filters.teacherId);
    }

    if (filters.department) {
      // Simuler le filtrage par département basé sur l'enseignant
      const teachersInDept = mockTeachers.filter(t => t.department === filters.department).map(t => t.id);
      filtered = filtered.filter(abs => teachersInDept.includes(abs.teacherId));
    }

    if (filters.type) {
      filtered = filtered.filter(abs => abs.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(abs => abs.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(abs => abs.startDate >= filters.startDate!);
    }

    if (filters.endDate) {
      filtered = filtered.filter(abs => abs.endDate <= filters.endDate!);
    }

    setFilteredAbsences(filtered);
  };

  const handleFilterChange = (key: keyof AbsenceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : `Enseignant ${teacherId}`;
  };

  const getTeacherDepartment = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.department : 'Inconnu';
  };

  const exportData = () => {
    // Logique d'export (CSV, PDF, etc.)
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'export..."
    });
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">{filteredAbsences.length}</p>
            <p className="text-sm text-blue-700">Total Absences</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-800">
              {filteredAbsences.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-sm text-amber-700">En Attente</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">
              {filteredAbsences.filter(a => a.status === 'approved').length}
            </p>
            <p className="text-sm text-green-700">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Filter className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">
              {Object.keys(filters).filter(key => filters[key as keyof AbsenceFilters]).length}
            </p>
            <p className="text-sm text-purple-700">Filtres Actifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Panneau de filtres avancés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres Avancés de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enseignant</label>
              <Select value={filters.teacherId || 'all'} onValueChange={(value) => handleFilterChange('teacherId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les enseignants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les enseignants</SelectItem>
                  {mockTeachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Département</label>
              <Select value={filters.department || 'all'} onValueChange={(value) => handleFilterChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Année Académique</label>
              <Select value={filters.academicYear || 'all'} onValueChange={(value) => handleFilterChange('academicYear', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type d'absence</label>
              <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {absenceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <Input
                type="date"
                value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <Input
                type="date"
                value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvée</SelectItem>
                  <SelectItem value="rejected">Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={resetFilters} variant="outline">
              Réinitialiser
            </Button>
            <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des absences */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des Absences ({filteredAbsences.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Chargement...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Cours Affectés</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAbsences.map((absence) => (
                  <TableRow key={absence.id}>
                    <TableCell className="font-medium">
                      {getTeacherName(absence.teacherId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTeacherDepartment(absence.teacherId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize">
                        {absence.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {Math.ceil((absence.endDate.getTime() - absence.startDate.getTime()) / (1000 * 60 * 60 * 24))} jour(s)
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(absence.status)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate">
                        {absence.coursesAffected?.join(', ') || 'Aucun'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
