
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
import { useToast } from "@/hooks/use-toast";

interface AdminAbsenceManagerProps {
  currentUser: UserType;
}

// Données mock complètes avec différents états
const mockAbsences: TeacherAbsence[] = [
  {
    id: "abs_1",
    teacherId: "teacher_1",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-16"),
    type: "maladie",
    reason: "Grippe saisonnière avec certificat médical",
    isJustified: true,
    justificationDocument: "certificat_medical_001.pdf",
    status: "approved",
    coursesAffected: ["INF101 - Algorithmique", "INF102 - Programmation"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "abs_2",
    teacherId: "teacher_2",
    startDate: new Date("2024-02-20"),
    endDate: new Date("2024-02-22"),
    type: "formation",
    reason: "Formation pédagogique - Nouvelles technologies",
    isJustified: true,
    status: "pending",
    coursesAffected: ["MATH201 - Analyse", "MATH202 - Algèbre"],
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15")
  },
  {
    id: "abs_3",
    teacherId: "teacher_3",
    startDate: new Date("2024-03-05"),
    endDate: new Date("2024-03-07"),
    type: "conge_annuel",
    reason: "Congé personnel planifié",
    isJustified: true,
    status: "approved",
    replacementTeacherId: "teacher_1",
    coursesAffected: ["PHY301 - Thermodynamique"],
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-28")
  },
  {
    id: "abs_4",
    teacherId: "teacher_1",
    startDate: new Date("2024-03-12"),
    endDate: new Date("2024-03-12"),
    type: "mission",
    reason: "Participation conférence internationale",
    isJustified: true,
    status: "rejected",
    coursesAffected: ["INF103 - Base de données"],
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date("2024-03-10")
  },
  {
    id: "abs_5",
    teacherId: "teacher_4",
    startDate: new Date("2024-04-10"),
    endDate: new Date("2024-04-15"),
    type: "maladie",
    reason: "Hospitalisation programmée",
    isJustified: true,
    justificationDocument: "certificat_hopital_002.pdf",
    status: "pending",
    coursesAffected: ["CHEM401 - Chimie organique", "CHEM402 - Spectroscopie"],
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05")
  },
  {
    id: "abs_6",
    teacherId: "teacher_5",
    startDate: new Date("2024-05-20"),
    endDate: new Date("2024-05-21"),
    type: "autre",
    reason: "Obligations familiales urgentes",
    isJustified: false,
    status: "approved",
    coursesAffected: ["BIO501 - Génétique"],
    createdAt: new Date("2024-05-18"),
    updatedAt: new Date("2024-05-19")
  }
];

const mockTeachers = [
  { id: 'teacher_1', name: 'Dr. Ahmed Benali', department: 'Informatique', email: 'ahmed.benali@fsecsg.dz' },
  { id: 'teacher_2', name: 'Dr. Fatima Kaci', department: 'Mathématiques', email: 'fatima.kaci@fsecsg.dz' },
  { id: 'teacher_3', name: 'Dr. Mohamed Saidi', department: 'Physique', email: 'mohamed.saidi@fsecsg.dz' },
  { id: 'teacher_4', name: 'Dr. Aicha Mammeri', department: 'Chimie', email: 'aicha.mammeri@fsecsg.dz' },
  { id: 'teacher_5', name: 'Dr. Omar Belkacem', department: 'Biologie', email: 'omar.belkacem@fsecsg.dz' },
  { id: 'teacher_6', name: 'Dr. Yasmine Khelif', department: 'Sciences', email: 'yasmine.khelif@fsecsg.dz' }
];

export const AdminAbsenceManager: React.FC<AdminAbsenceManagerProps> = ({ currentUser }) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>(mockAbsences);
  const [filteredAbsences, setFilteredAbsences] = useState<TeacherAbsence[]>(mockAbsences);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { toast } = useToast();

  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Sciences'];
  const academicYears = ['2023-2024', '2024-2025', '2025-2026'];
  const semesters = ['S1 2024-2025', 'S2 2024-2025', 'S1 2023-2024', 'S2 2023-2024'];
  const absenceTypes = [
    { value: 'maladie', label: 'Maladie' },
    { value: 'conge_annuel', label: 'Congé annuel' },
    { value: 'formation', label: 'Formation' },
    { value: 'mission', label: 'Mission' },
    { value: 'autre', label: 'Autre' }
  ];

  useEffect(() => {
    applyFilters();
  }, [selectedTeacher, selectedDepartment, selectedPeriod, selectedStatus, selectedType, searchTerm, startDate, endDate]);

  const applyFilters = () => {
    let filtered = [...absences];

    // Filtre par enseignant
    if (selectedTeacher !== 'all') {
      filtered = filtered.filter(abs => abs.teacherId === selectedTeacher);
    }

    // Filtre par département
    if (selectedDepartment !== 'all') {
      const teachersInDept = mockTeachers.filter(t => t.department === selectedDepartment).map(t => t.id);
      filtered = filtered.filter(abs => teachersInDept.includes(abs.teacherId));
    }

    // Filtre par période
    if (selectedPeriod !== 'all') {
      const currentDate = new Date();
      switch (selectedPeriod) {
        case 'semester':
          const currentMonth = currentDate.getMonth();
          const isFirstSemester = currentMonth >= 8 || currentMonth <= 1;
          filtered = filtered.filter(abs => {
            const absMonth = abs.startDate.getMonth();
            return isFirstSemester ? (absMonth >= 8 || absMonth <= 1) : (absMonth >= 1 && absMonth <= 7);
          });
          break;
        case 'academic_year':
          const currentYear = currentDate.getFullYear();
          const academicYearStart = currentDate.getMonth() >= 8 ? currentYear : currentYear - 1;
          filtered = filtered.filter(abs => {
            const absYear = abs.startDate.getFullYear();
            return absYear === academicYearStart || absYear === academicYearStart + 1;
          });
          break;
      }
    }

    // Filtre par dates personnalisées
    if (startDate) {
      filtered = filtered.filter(abs => abs.startDate >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(abs => abs.endDate <= new Date(endDate));
    }

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(abs => abs.status === selectedStatus);
    }

    // Filtre par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(abs => abs.type === selectedType);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(abs => {
        const teacherName = getTeacherName(abs.teacherId).toLowerCase();
        return teacherName.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredAbsences(filtered);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : `Enseignant ${teacherId}`;
  };

  const getTeacherDepartment = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.department : 'Inconnu';
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

  const handleApproveAbsence = (absenceId: string) => {
    setAbsences(prev => prev.map(abs => 
      abs.id === absenceId ? { ...abs, status: 'approved' as const, updatedAt: new Date() } : abs
    ));
    toast({
      title: "Absence approuvée",
      description: "L'absence a été approuvée avec succès",
    });
  };

  const handleRejectAbsence = (absenceId: string) => {
    setAbsences(prev => prev.map(abs => 
      abs.id === absenceId ? { ...abs, status: 'rejected' as const, updatedAt: new Date() } : abs
    ));
    toast({
      title: "Absence rejetée",
      description: "L'absence a été rejetée",
      variant: "destructive"
    });
  };

  const exportToCSV = () => {
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

  const resetFilters = () => {
    setSelectedTeacher('all');
    setSelectedDepartment('all');
    setSelectedPeriod('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    toast({
      title: "Filtres réinitialisés",
      description: "Tous les filtres ont été effacés",
    });
  };

  const getTotalStats = () => {
    return {
      total: filteredAbsences.length,
      pending: filteredAbsences.filter(a => a.status === 'pending').length,
      approved: filteredAbsences.filter(a => a.status === 'approved').length,
      rejected: filteredAbsences.filter(a => a.status === 'rejected').length,
      totalDays: filteredAbsences.reduce((total, abs) => {
        const days = Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0),
      teachersCount: new Set(filteredAbsences.map(a => a.teacherId)).size
    };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* En-tête */}
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

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
            <p className="text-xs text-blue-700">Total</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-amber-800">{stats.pending}</p>
            <p className="text-xs text-amber-700">En Attente</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-800">{stats.approved}</p>
            <p className="text-xs text-green-700">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-800">{stats.rejected}</p>
            <p className="text-xs text-red-700">Rejetées</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-purple-800">{stats.teachersCount}</p>
            <p className="text-xs text-purple-700">Enseignants</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-orange-800">{stats.totalDays}</p>
            <p className="text-xs text-orange-700">Jours Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un enseignant par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sélecteurs de filtres */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Enseignant" />
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

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Département" />
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

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="semester">Semestre actuel</SelectItem>
                <SelectItem value="academic_year">Année académique</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvée</SelectItem>
                <SelectItem value="rejected">Rejetée</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
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

          {/* Filtres de dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date de début</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date de fin</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={resetFilters} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
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
        </CardHeader>
        <CardContent>
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
                  <TableHead>Motif</TableHead>
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
                        <div className="text-xs text-gray-500">jour(s)</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(absence.status)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={absence.reason}>
                        {absence.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Button size="sm" variant="outline">
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
