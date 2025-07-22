
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Users, 
  FileText, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Clock,
  UserCheck,
  AlertTriangle,
  BarChart3,
  Search,
  MapPin,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "../../types/user";

interface AbsenceRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherDepartment: string;
  startDate: Date;
  endDate: Date;
  type: 'maladie' | 'formation' | 'conge_annuel' | 'mission' | 'personnel';
  reason: string;
  status: 'en_attente' | 'approuvee' | 'rejetee';
  managementType: 'remplacement' | 'recuperation';
  replacementTeacher?: string;
  recoveryDates?: Date[];
  affectedCourses: string[];
  submissionDate: Date;
  reviewDate?: Date;
  reviewerName?: string;
  reviewComments?: string;
  documents?: string[];
}

const mockAbsenceRequests: AbsenceRequest[] = [
  {
    id: "1",
    teacherId: "teacher1",
    teacherName: "Dr. Ahmed Benali",
    teacherDepartment: "Informatique",
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-16'),
    type: 'maladie',
    reason: 'Grippe saisonnière',
    status: 'approuvee',
    managementType: 'remplacement',
    replacementTeacher: "Dr. Fatima Zahra",
    affectedCourses: ['INF101 - Algorithmique (L1)', 'INF102 - Programmation (L1)'],
    submissionDate: new Date('2024-01-14'),
    reviewDate: new Date('2024-01-14'),
    reviewerName: "M. Karim Messaoudi",
    reviewComments: "Remplacement approuvé"
  },
  {
    id: "2",
    teacherId: "teacher2",
    teacherName: "Dr. Youcef Mammeri",
    teacherDepartment: "Mathématiques",
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-02-21'),
    type: 'formation',
    reason: 'Conférence internationale sur l\'IA',
    status: 'en_attente',
    managementType: 'recuperation',
    recoveryDates: [new Date('2024-02-25'), new Date('2024-02-27')],
    affectedCourses: ['INF201 - Base de données (L2)', 'INF202 - Réseaux (L2)'],
    submissionDate: new Date('2024-02-18')
  },
  {
    id: "3",
    teacherId: "teacher3",
    teacherName: "Dr. Leila Amrani",
    teacherDepartment: "Informatique",
    startDate: new Date('2024-01-08'),
    endDate: new Date('2024-01-10'),
    type: 'conge_annuel',
    reason: 'Congé annuel planifié',
    status: 'rejetee',
    managementType: 'remplacement',
    replacementTeacher: "Dr. Said Benaissa",
    affectedCourses: ['INF301 - Génie logiciel (L3)'],
    submissionDate: new Date('2024-01-05'),
    reviewDate: new Date('2024-01-06'),
    reviewerName: "Mme. Fatima Zahra",
    reviewComments: "Période de haute activité académique"
  },
  {
    id: "4",
    teacherId: "teacher4",
    teacherName: "Dr. Rachid Khelifi",
    teacherDepartment: "Mathématiques",
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    type: 'mission',
    reason: 'Mission d\'expertise au ministère',
    status: 'approuvee',
    managementType: 'recuperation',
    recoveryDates: [new Date('2024-03-20'), new Date('2024-03-22'), new Date('2024-03-24')],
    affectedCourses: ['MAT201 - Analyse (L2)', 'MAT301 - Statistiques (L3)'],
    submissionDate: new Date('2024-03-10'),
    reviewDate: new Date('2024-03-12'),
    reviewerName: "Dr. Ahmed Benali",
    reviewComments: "Mission approuvée par le décanat"
  }
];

const departments = [
  'Informatique', 'Mathématiques', 'Physique', 'Chimie', 'Biologie'
];

const teachers = [
  { id: 'teacher1', name: 'Dr. Ahmed Benali', department: 'Informatique' },
  { id: 'teacher2', name: 'Dr. Youcef Mammeri', department: 'Mathématiques' },
  { id: 'teacher3', name: 'Dr. Leila Amrani', department: 'Informatique' },
  { id: 'teacher4', name: 'Dr. Rachid Khelifi', department: 'Mathématiques' },
  { id: 'teacher5', name: 'Dr. Said Benaissa', department: 'Physique' }
];

const academicYears = ['2023-2024', '2024-2025'];
const semesters = ['S1', 'S2'];

interface AdminAbsenceManagementProps {
  currentUser: UserType;
}

export const AdminAbsenceManagement: React.FC<AdminAbsenceManagementProps> = ({ currentUser }) => {
  const [requests, setRequests] = useState<AbsenceRequest[]>(mockAbsenceRequests);
  const [filteredRequests, setFilteredRequests] = useState<AbsenceRequest[]>(mockAbsenceRequests);
  const [selectedRequest, setSelectedRequest] = useState<AbsenceRequest | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  
  // Filtres
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    applyFilters();
  }, [selectedTeacher, selectedDepartment, selectedStatus, selectedType, selectedYear, selectedSemester, dateFrom, dateTo, searchTerm, requests]);

  const applyFilters = () => {
    let filtered = [...requests];

    // Filtre par enseignant
    if (selectedTeacher !== 'all') {
      filtered = filtered.filter(req => req.teacherId === selectedTeacher);
    }

    // Filtre par département
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(req => req.teacherDepartment === selectedDepartment);
    }

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(req => req.status === selectedStatus);
    }

    // Filtre par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(req => req.type === selectedType);
    }

    // Filtre par dates
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(req => req.startDate >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      filtered = filtered.filter(req => req.endDate <= toDate);
    }

    // Recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.affectedCourses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredRequests(filtered);
  };

  const resetFilters = () => {
    setSelectedTeacher('all');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSelectedYear('all');
    setSelectedSemester('all');
    setDateFrom('');
    setDateTo('');
    setSearchTerm('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'approuvee':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><Check className="h-3 w-3 mr-1" />Approuvée</Badge>;
      case 'rejetee':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><X className="h-3 w-3 mr-1" />Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      'maladie': { label: 'Maladie', color: 'bg-red-50 text-red-700 border-red-200' },
      'formation': { label: 'Formation', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'conge_annuel': { label: 'Congé annuel', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      'mission': { label: 'Mission', color: 'bg-orange-50 text-orange-700 border-orange-200' },
      'personnel': { label: 'Personnel', color: 'bg-gray-50 text-gray-700 border-gray-200' }
    };
    
    const typeInfo = typeLabels[type as keyof typeof typeLabels] || { label: type, color: 'bg-gray-50 text-gray-700' };
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  const handleApprove = (requestId: string, comments: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approuvee' as const, 
            reviewDate: new Date(),
            reviewerName: currentUser.name,
            reviewComments: comments
          }
        : req
    ));
    toast({
      title: "Demande approuvée",
      description: "La demande d'absence a été approuvée avec succès.",
    });
  };

  const handleReject = (requestId: string, comments: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'rejetee' as const, 
            reviewDate: new Date(),
            reviewerName: currentUser.name,
            reviewComments: comments
          }
        : req
    ));
    toast({
      title: "Demande rejetée",
      description: "La demande d'absence a été rejetée.",
      variant: "destructive"
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Enseignant', 'Département', 'Période', 'Type', 'Motif', 'Statut', 'Gestion', 'Cours affectés', 'Soumission', 'Révision'].join(','),
      ...filteredRequests.map(req => [
        req.teacherName,
        req.teacherDepartment,
        `${req.startDate.toLocaleDateString('fr-FR')} - ${req.endDate.toLocaleDateString('fr-FR')}`,
        req.type,
        req.reason,
        req.status,
        req.managementType,
        req.affectedCourses.join('; '),
        req.submissionDate.toLocaleDateString('fr-FR'),
        req.reviewDate ? req.reviewDate.toLocaleDateString('fr-FR') : 'Non révisée'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `absences_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: `${filteredRequests.length} demandes exportées`,
    });
  };

  // Statistiques
  const stats = {
    total: filteredRequests.length,
    enAttente: filteredRequests.filter(r => r.status === 'en_attente').length,
    approuvees: filteredRequests.filter(r => r.status === 'approuvee').length,
    rejetees: filteredRequests.filter(r => r.status === 'rejetee').length,
    enseignants: [...new Set(filteredRequests.map(r => r.teacherId))].length,
    departements: [...new Set(filteredRequests.map(r => r.teacherDepartment))].length,
    totalJours: filteredRequests.reduce((total, req) => {
      const days = Math.ceil((req.endDate.getTime() - req.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0)
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <UserCheck className="h-5 w-5" />
            Gestion Administrative des Absences
          </CardTitle>
          <p className="text-red-600">
            Filtrage, approbation et suivi des demandes d'absence des enseignants
          </p>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
            <p className="text-xs text-blue-700">Total</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-yellow-800">{stats.enAttente}</p>
            <p className="text-xs text-yellow-700">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-800">{stats.approuvees}</p>
            <p className="text-xs text-green-700">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <X className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-800">{stats.rejetees}</p>
            <p className="text-xs text-red-700">Rejetées</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-purple-800">{stats.enseignants}</p>
            <p className="text-xs text-purple-700">Enseignants</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-orange-800">{stats.departements}</p>
            <p className="text-xs text-orange-700">Départements</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-indigo-800">{stats.totalJours}</p>
            <p className="text-xs text-indigo-700">Jours total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="filtrage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="filtrage">Filtrage & Vue Globale</TabsTrigger>
          <TabsTrigger value="approbation">Approbation</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques Avancées</TabsTrigger>
        </TabsList>

        <TabsContent value="filtrage" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres Avancés
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={resetFilters} variant="outline">
                    Réinitialiser
                  </Button>
                  <Button onClick={exportToCSV} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Enseignant</Label>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les enseignants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les enseignants</SelectItem>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Département</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les départements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les départements</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Statut</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="approuvee">Approuvées</SelectItem>
                      <SelectItem value="rejetee">Rejetées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="maladie">Maladie</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="conge_annuel">Congé annuel</SelectItem>
                      <SelectItem value="mission">Mission</SelectItem>
                      <SelectItem value="personnel">Personnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Année académique</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les années</SelectItem>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Semestre</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les semestres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les semestres</SelectItem>
                      {semesters.map(semester => (
                        <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date début</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Date fin</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Recherche</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nom, motif, cours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des demandes */}
          <Card>
            <CardHeader>
              <CardTitle>Demandes d'Absence ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Gestion</TableHead>
                    <TableHead>Cours affectés</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.teacherName}</p>
                          <p className="text-sm text-gray-500">{request.teacherDepartment}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {request.startDate.toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm">
                            au {request.endDate.toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(request.type)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {request.managementType === 'remplacement' ? 'Remplacement' : 'Récupération'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {request.affectedCourses.map((course, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setSelectedRequest(request); setIsReviewDialogOpen(true); }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {request.status === 'en_attente' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApprove(request.id, 'Approuvé automatiquement')}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleReject(request.id, 'Rejeté automatiquement')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approbation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demandes en Attente d'Approbation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRequests.filter(req => req.status === 'en_attente').map((request) => (
                  <Card key={request.id} className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{request.teacherName}</h3>
                            <Badge variant="outline">{request.teacherDepartment}</Badge>
                            {getTypeBadge(request.type)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.reason}</p>
                          <p className="text-sm">
                            Période: {request.startDate.toLocaleDateString('fr-FR')} - {request.endDate.toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm">
                            Gestion: {request.managementType === 'remplacement' ? 'Remplacement' : 'Récupération'}
                            {request.replacementTeacher && ` par ${request.replacementTeacher}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedRequest(request);
                              setReviewComments('');
                              setIsReviewDialogOpen(true);
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSelectedRequest(request);
                              setReviewComments('');
                              setIsReviewDialogOpen(true);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistiques" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Répartition par Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['maladie', 'formation', 'conge_annuel', 'mission', 'personnel'].map(type => {
                    const count = filteredRequests.filter(r => r.type === type).length;
                    const percentage = filteredRequests.length > 0 ? (count / filteredRequests.length) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeBadge(type)}
                          <span className="text-sm">{count} demandes</span>
                        </div>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Répartition par Département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map(dept => {
                    const count = filteredRequests.filter(r => r.teacherDepartment === dept).length;
                    const percentage = filteredRequests.length > 0 ? (count / filteredRequests.length) * 100 : 0;
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{dept}</Badge>
                          <span className="text-sm">{count} demandes</span>
                        </div>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de révision */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Révision de Demande d'Absence</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Enseignant</Label>
                  <p className="font-medium">{selectedRequest.teacherName}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.teacherDepartment}</p>
                </div>
                <div>
                  <Label>Période</Label>
                  <p>{selectedRequest.startDate.toLocaleDateString('fr-FR')} - {selectedRequest.endDate.toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div>
                <Label>Type et Motif</Label>
                <div className="flex items-center gap-2 mb-2">
                  {getTypeBadge(selectedRequest.type)}
                </div>
                <p>{selectedRequest.reason}</p>
              </div>
              <div>
                <Label>Cours affectés</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedRequest.affectedCourses.map((course, index) => (
                    <Badge key={index} variant="outline">{course}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Gestion proposée</Label>
                <p>{selectedRequest.managementType === 'remplacement' ? 'Remplacement' : 'Récupération'}</p>
                {selectedRequest.replacementTeacher && (
                  <p className="text-sm text-gray-600">Remplaçant: {selectedRequest.replacementTeacher}</p>
                )}
              </div>
              <div>
                <Label htmlFor="reviewComments">Commentaires de révision</Label>
                <Textarea
                  id="reviewComments"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Ajoutez vos commentaires..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleApprove(selectedRequest.id, reviewComments);
                    setIsReviewDialogOpen(false);
                    setReviewComments('');
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  onClick={() => {
                    handleReject(selectedRequest.id, reviewComments);
                    setIsReviewDialogOpen(false);
                    setReviewComments('');
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  variant="destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
