
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Filter, Users, Download, BarChart3, TrendingUp, CheckCircle, XCircle, Eye, RefreshCw, FileText, Search, Clock } from "lucide-react";
import { User as UserType } from "../../types/user";
import { TeacherAbsence } from "../../types/teacher";
import { absenceService, AbsenceFilters } from "../../services/absenceService";
import { useToast } from "@/hooks/use-toast";

interface AdminAbsenceManagementTabProps {
  currentUser: UserType;
}

export const AdminAbsenceManagementTab: React.FC<AdminAbsenceManagementTabProps> = ({ currentUser }) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [filteredAbsences, setFilteredAbsences] = useState<TeacherAbsence[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AbsenceFilters>({});
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'semester' | 'academic_year' | 'custom'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie'];
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  const semesters = ['S1 2024-2025', 'S2 2024-2025', 'S1 2023-2024', 'S2 2023-2024'];
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
  }, [absences, filters, searchTerm, selectedPeriod]);

  const loadAbsences = async () => {
    setLoading(true);
    try {
      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
      toast({
        title: "Données actualisées",
        description: `${data.length} absences chargées avec succès`,
      });
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

    // Filtre par terme de recherche (nom d'enseignant)
    if (searchTerm) {
      filtered = filtered.filter(abs => {
        const teacherName = getTeacherName(abs.teacherId).toLowerCase();
        return teacherName.includes(searchTerm.toLowerCase());
      });
    }

    // Filtre par enseignant spécifique
    if (filters.teacherId) {
      filtered = filtered.filter(abs => abs.teacherId === filters.teacherId);
    }

    // Filtre par département
    if (filters.department) {
      const teachersInDept = mockTeachers.filter(t => t.department === filters.department).map(t => t.id);
      filtered = filtered.filter(abs => teachersInDept.includes(abs.teacherId));
    }

    // Filtre par type d'absence
    if (filters.type) {
      filtered = filtered.filter(abs => abs.type === filters.type);
    }

    // Filtre par statut
    if (filters.status) {
      filtered = filtered.filter(abs => abs.status === filters.status);
    }

    // Filtre par période
    if (selectedPeriod !== 'all') {
      const currentDate = new Date();
      switch (selectedPeriod) {
        case 'semester':
          // Logique pour semestre actuel
          const currentMonth = currentDate.getMonth();
          const isFirstSemester = currentMonth >= 8 || currentMonth <= 1; // Sept-Jan
          filtered = filtered.filter(abs => {
            const absMonth = abs.startDate.getMonth();
            return isFirstSemester ? (absMonth >= 8 || absMonth <= 1) : (absMonth >= 1 && absMonth <= 7);
          });
          break;
        case 'academic_year':
          // Logique pour année académique actuelle
          const currentYear = currentDate.getFullYear();
          const academicYearStart = currentDate.getMonth() >= 8 ? currentYear : currentYear - 1;
          filtered = filtered.filter(abs => {
            const absYear = abs.startDate.getFullYear();
            return absYear === academicYearStart || absYear === academicYearStart + 1;
          });
          break;
        case 'custom':
          // Utilise les dates de début et fin
          if (filters.startDate) {
            filtered = filtered.filter(abs => abs.startDate >= filters.startDate!);
          }
          if (filters.endDate) {
            filtered = filtered.filter(abs => abs.endDate <= filters.endDate!);
          }
          break;
      }
    }

    // Filtre par année académique spécifique
    if (filters.academicYear) {
      filtered = filtered.filter(abs => {
        const year = abs.startDate.getFullYear();
        return filters.academicYear?.includes(year.toString());
      });
    }

    setFilteredAbsences(filtered);
  };

  const handleFilterChange = (key: keyof AbsenceFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setSelectedPeriod('all');
    setSearchTerm('');
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été effacés",
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Enseignant', 'Département', 'Type', 'Date début', 'Date fin', 'Durée (jours)', 'Statut', 'Motif', 'Cours Affectés'].join(','),
      ...filteredAbsences.map(abs => [
        `"${getTeacherName(abs.teacherId)}"`,
        `"${getTeacherDepartment(abs.teacherId)}"`,
        abs.type,
        abs.startDate.toLocaleDateString('fr-FR'),
        abs.endDate.toLocaleDateString('fr-FR'),
        Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        abs.status,
        `"${abs.reason}"`,
        `"${abs.coursesAffected?.join(', ') || 'Aucun'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `absences_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: `${filteredAbsences.length} absences exportées en CSV`,
    });
  };

  const exportPDFReport = () => {
    // Simuler génération de rapport PDF
    toast({
      title: "Rapport PDF généré",
      description: "Le rapport détaillé des absences a été généré",
    });
  };

  const handleApproveAbsence = async (absenceId: string) => {
    try {
      await absenceService.approveAbsence(currentUser, absenceId);
      await loadAbsences();
      toast({
        title: "Absence approuvée",
        description: "L'absence a été approuvée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'absence",
        variant: "destructive"
      });
    }
  };

  const handleRejectAbsence = async (absenceId: string) => {
    try {
      await absenceService.rejectAbsence(currentUser, absenceId, "Rejetée par l'administrateur");
      await loadAbsences();
      toast({
        title: "Absence rejetée",
        description: "L'absence a été rejetée",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'absence",
        variant: "destructive"
      });
    }
  };

  const viewAbsenceDetails = (absence: TeacherAbsence) => {
    const duration = Math.ceil((absence.endDate.getTime() - absence.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    toast({
      title: "Détails de l'absence",
      description: `${getTeacherName(absence.teacherId)} - ${absence.type} du ${absence.startDate.toLocaleDateString('fr-FR')} au ${absence.endDate.toLocaleDateString('fr-FR')} (${duration} jour${duration > 1 ? 's' : ''})`,
    });
  };

  const viewTeacherHistory = (teacherId: string) => {
    const teacherAbsences = absences.filter(abs => abs.teacherId === teacherId);
    toast({
      title: "Historique enseignant",
      description: `${getTeacherName(teacherId)} : ${teacherAbsences.length} absence${teacherAbsences.length > 1 ? 's' : ''} au total`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejetée</Badge>;
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

  const getTotalAbsenceDays = () => {
    return filteredAbsences.reduce((total, abs) => {
      const days = Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* En-tête administratif avec statistiques enrichies */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="h-6 w-6" />
            Gestion Administrative des Absences - {currentUser.role === 'super_admin' ? 'Super Administrateur' : 
              currentUser.role === 'admin_faculty' ? 'Doyen' : 
              currentUser.role === 'dept_head' ? 'Chef de Département' : 
              'Responsable Programmation et Suivi'}
          </CardTitle>
          <p className="text-blue-700">
            Interface complète de gestion des absences enseignantes avec analyse par période, département et enseignant
          </p>
        </CardHeader>
      </Card>

      {/* Statistiques avancées */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              {new Set(filteredAbsences.map(a => a.teacherId)).size}
            </p>
            <p className="text-sm text-purple-700">Enseignants</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-800">{getTotalAbsenceDays()}</p>
            <p className="text-sm text-orange-700">Jours Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Panneau de recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et Filtres Avancés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="mb-4">
            <Input
              placeholder="Rechercher un enseignant par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Sélection de période */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Période d'analyse</label>
            <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="semester">Semestre actuel</SelectItem>
                <SelectItem value="academic_year">Année académique actuelle</SelectItem>
                <SelectItem value="custom">Période personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtres principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enseignant Spécifique</label>
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

          {/* Filtres de dates pour période personnalisée */}
          {selectedPeriod === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={resetFilters} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={loadAbsences} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={exportData} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
            <Button onClick={exportPDFReport} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Rapport PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des absences */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des Absences ({filteredAbsences.length} résultat{filteredAbsences.length > 1 ? 's' : ''})
          </CardTitle>
          <p className="text-sm text-gray-600">
            Total de {getTotalAbsenceDays()} jour{getTotalAbsenceDays() > 1 ? 's' : ''} d'absence
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Chargement des absences...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <TableHead>Motif</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAbsences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        Aucune absence trouvée avec les critères sélectionnés
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAbsences.map((absence) => (
                      <TableRow key={absence.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{getTeacherName(absence.teacherId)}</div>
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="p-0 h-auto text-xs text-blue-600"
                              onClick={() => viewTeacherHistory(absence.teacherId)}
                            >
                              Voir historique
                            </Button>
                          </div>
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
                          <div className="text-sm">
                            <div>{absence.startDate.toLocaleDateString('fr-FR')}</div>
                            <div className="text-gray-500">au {absence.endDate.toLocaleDateString('fr-FR')}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="font-semibold">
                              {Math.ceil((absence.endDate.getTime() - absence.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1}
                            </span>
                            <div className="text-xs text-gray-500">jour{Math.ceil((absence.endDate.getTime() - absence.startDate.getTime()) / (1000 * 60 * 60 * 24)) > 0 ? 's' : ''}</div>
                          </div>
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
                          <div className="max-w-32 truncate" title={absence.reason}>
                            {absence.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => viewAbsenceDetails(absence)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                            {absence.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApproveAbsence(absence.id)}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approuver
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectAbsence(absence.id)}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rejeter
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
