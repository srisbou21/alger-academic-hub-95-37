
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkloadAssignmentForm } from "./workload/WorkloadAssignmentForm";
import { TeacherWorkloadFilters } from "./workload/TeacherWorkloadFilters";
import { TeacherWorkloadView } from "./workload/TeacherWorkloadView";
import { WorkloadConflictDetector } from "./workload/WorkloadConflictDetector";
import { academicConfigService } from "../../services/academicConfigService";
import { teacherDataService, TeacherForAssignment } from "../../services/teacherDataService";
import { 
  normalizeString, 
  createTeacherWithWorkload, 
  filterTeachersByWorkload, 
  getWorkloadStatistics 
} from "../../utils/workloadUtils";

interface Teacher {
  id: string;
  name: string;
  grade: string;
  department: string;
  specialty: string;
  maxHours: number;
  currentHours: number;
}

interface Specialty {
  id: string;
  name: string;
  code: string;
  level: 'licence' | 'master' | 'doctorat';
  filiereId: string;
  duration: number;
}

interface Module {
  id: string;
  name: string;
  code: string;
  specialtyId: string;
  semester: 'S1' | 'S2' | 'Année';
  totalHours: number;
  atomTypes: {
    cours?: number;
    td?: number;
    tp?: number;
  };
}

interface Section {
  id: string;
  name: string;
  capacity: number;
  groups: Group[];
}

interface Group {
  id: string;
  name: string;
  type: 'td' | 'tp';
  capacity: number;
  sectionId: string;
}

const mockModules: Module[] = [
  { 
    id: "1", 
    name: "Algorithmique et Structures de Données", 
    code: "INF101", 
    specialtyId: "1", 
    semester: "S1", 
    totalHours: 67.5,
    atomTypes: { cours: 22.5, td: 22.5, tp: 22.5 }
  },
  { 
    id: "2", 
    name: "Programmation Orientée Objet", 
    code: "INF201", 
    specialtyId: "1", 
    semester: "S2", 
    totalHours: 67.5,
    atomTypes: { cours: 22.5, td: 22.5, tp: 22.5 }
  },
  { 
    id: "3", 
    name: "Base de Données Avancées", 
    code: "INF301", 
    specialtyId: "2", 
    semester: "S1", 
    totalHours: 45,
    atomTypes: { cours: 15, td: 15, tp: 15 }
  }
];

const mockSections: Section[] = [
  {
    id: "1",
    name: "Section A",
    capacity: 40,
    groups: [
      { id: "1", name: "Groupe 1", type: "td", capacity: 20, sectionId: "1" },
      { id: "2", name: "Groupe 2", type: "td", capacity: 20, sectionId: "1" },
      { id: "3", name: "Groupe 1", type: "tp", capacity: 15, sectionId: "1" },
      { id: "4", name: "Groupe 2", type: "tp", capacity: 15, sectionId: "1" }
    ]
  },
  {
    id: "2",
    name: "Section B",
    capacity: 35,
    groups: [
      { id: "5", name: "Groupe 1", type: "td", capacity: 18, sectionId: "2" },
      { id: "6", name: "Groupe 2", type: "td", capacity: 17, sectionId: "2" }
    ]
  }
];

export const WorkloadAdministration: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [teachers, setTeachers] = useState<TeacherForAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedTarget, setSelectedTarget] = useState('all');
  
  const { toast } = useToast();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      console.log('Chargement des données pour l\'administration des charges...');
      
      // Charger les spécialités et les enseignants en parallèle
      const [specialtiesData, teachersData] = await Promise.all([
        academicConfigService.getSpecialties(),
        teacherDataService.getTeachersFromHR()
      ]);
      
      console.log('Spécialités chargées:', specialtiesData);
      console.log('Enseignants chargés depuis GRH:', teachersData);
      
      setSpecialties(specialtiesData);
      setTeachers(teachersData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignModule = (assignment: any) => {
    // Check for conflicts
    const hasConflict = assignments.some(existing => 
      existing.moduleId === assignment.moduleId && 
      existing.targetAudience.id === assignment.targetAudience.id &&
      existing.atomType === assignment.atomType
    );

    if (hasConflict) {
      toast({
        title: "Conflit détecté",
        description: "Ce module est déjà affecté à un autre enseignant pour cette cible",
        variant: "destructive"
      });
      return;
    }

    setAssignments([...assignments, assignment]);
    
    const teacher = teachers.find(t => t.id === assignment.teacherId);
    toast({
      title: "Attribution créée",
      description: `Module ${assignment.moduleName} attribué à ${teacher?.name}`,
    });
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));
    toast({
      title: "Attribution supprimée",
      description: "L'attribution a été supprimée avec succès",
    });
  };

  const exportAssignments = () => {
    const csvContent = [
      ['Enseignant', 'Module', 'Spécialité', 'Type', 'Cible', 'Heures/Semaine', 'Total Heures', 'Statut'].join(','),
      ...assignments.map(assignment => {
        const teacher = teachers.find(t => t.id === assignment.teacherId);
        return [
          teacher?.name || 'Non assigné',
          assignment.moduleName,
          assignment.specialtyName,
          assignment.atomType.toUpperCase(),
          assignment.targetAudience.name,
          assignment.hoursPerWeek.toString(),
          assignment.totalHours.toString(),
          assignment.isConfirmed ? 'Confirmé' : 'En attente'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attributions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: `${assignments.length} attributions exportées`,
    });
  };

  const getSpecialtyName = (specialtyId: string): string => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.name : 'Spécialité inconnue';
  };

  // Fonction pour effacer tous les filtres
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
    setSelectedSemester('all');
    setSelectedModule('all');
    setSelectedTarget('all');
  };

  // Transformation des enseignants avec leurs charges
  const teachersWithWorkload = useMemo(() => {
    return teachers.map(teacher => createTeacherWithWorkload(teacher, assignments));
  }, [teachers, assignments]);

  // Filtrage des enseignants selon les critères
  const filteredTeachers = useMemo(() => {
    return teachersWithWorkload.filter(teacher => 
      filterTeachersByWorkload(teacher, assignments, {
        searchTerm,
        selectedSpecialty,
        selectedSemester,
        selectedModule,
        selectedTarget
      })
    );
  }, [teachersWithWorkload, assignments, searchTerm, selectedSpecialty, selectedSemester, selectedModule, selectedTarget]);

  const stats = getWorkloadStatistics(filteredTeachers);

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <UserCheck className="h-5 w-5" />
            Administration des Charges Pédagogiques
          </CardTitle>
          <p className="text-blue-600">
            Gestion et attribution des modules aux enseignants par spécialité, semestre et cible
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assignments">Attributions</TabsTrigger>
          <TabsTrigger value="teachers">Vue Enseignants</TabsTrigger>
          <TabsTrigger value="conflicts">Conflits & Alertes</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attributions de Modules</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setIsAssignDialogOpen(true)}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {loading ? 'Chargement...' : 'Nouvelle Attribution'}
                  </Button>
                  <Button variant="outline" onClick={exportAssignments}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>Heures</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => {
                    const teacher = teachers.find(t => t.id === assignment.teacherId);
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{teacher?.name || 'Non assigné'}</p>
                            <p className="text-sm text-gray-500">{teacher?.grade}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assignment.moduleName}</p>
                            <p className="text-sm text-gray-500">{assignment.specialtyName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{assignment.specialtyName}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            assignment.atomType === 'cours' ? 'bg-blue-100 text-blue-800' :
                            assignment.atomType === 'td' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }>
                            {assignment.atomType.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{assignment.targetAudience.name}</TableCell>
                        <TableCell>
                          <div>
                            <p>{assignment.hoursPerWeek}h/sem</p>
                            <p className="text-sm text-gray-500">{assignment.totalHours}h total</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={assignment.isConfirmed ? "default" : "secondary"}>
                            {assignment.isConfirmed ? 'Confirmé' : 'En attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {assignments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Aucune attribution pour le moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <TeacherWorkloadFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSpecialty={selectedSpecialty}
            setSelectedSpecialty={setSelectedSpecialty}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            selectedTarget={selectedTarget}
            setSelectedTarget={setSelectedTarget}
            specialties={specialties}
            modules={[]}
            sections={[]}
            onClearFilters={clearAllFilters}
          />
          
          <TeacherWorkloadView
            teachers={filteredTeachers}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          <WorkloadConflictDetector
            teachers={teachersWithWorkload}
            assignments={assignments}
            onRefresh={loadAllData}
          />
        </TabsContent>
      </Tabs>

      <WorkloadAssignmentForm
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        onSubmit={handleAssignModule}
        teachers={teachers}
      />
    </div>
  );
};
