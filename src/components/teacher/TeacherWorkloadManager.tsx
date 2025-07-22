
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Calendar,
  FileText,
  Download
} from "lucide-react";

interface CourseAssignment {
  id: string;
  moduleCode: string;
  moduleName: string;
  level: string;
  formation: string;
  type: 'CM' | 'TD' | 'TP';
  weeklyHours: number;
  totalHours: number;
  groupCount: number;
  studentCount: number;
  semester: 'S1' | 'S2';
  status: 'assigned' | 'confirmed' | 'pending' | 'rejected';
  assignedDate: Date;
}

interface WorkloadSummary {
  totalHours: number;
  maxHours: number;
  percentage: number;
  status: 'under' | 'normal' | 'over';
  bySemester: {
    S1: number;
    S2: number;
  };
  byType: {
    CM: number;
    TD: number;
    TP: number;
  };
}

export const TeacherWorkloadManager = () => {
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [workloadSummary, setWorkloadSummary] = useState<WorkloadSummary>({
    totalHours: 0,
    maxHours: 180,
    percentage: 0,
    status: 'under',
    bySemester: { S1: 0, S2: 0 },
    byType: { CM: 0, TD: 0, TP: 0 }
  });
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'S1' | 'S2'>('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const { toast } = useToast();

  useEffect(() => {
    // Simulation des charges d'enseignement
    const mockAssignments: CourseAssignment[] = [
      {
        id: '1',
        moduleCode: 'ECON301',
        moduleName: 'Microéconomie Avancée',
        level: 'L3',
        formation: 'Sciences Économiques',
        type: 'CM',
        weeklyHours: 1.5,
        totalHours: 22.5,
        groupCount: 1,
        studentCount: 45,
        semester: 'S1',
        status: 'confirmed',
        assignedDate: new Date('2024-09-01')
      },
      {
        id: '2',
        moduleCode: 'ECON301',
        moduleName: 'Microéconomie Avancée',
        level: 'L3',
        formation: 'Sciences Économiques',
        type: 'TD',
        weeklyHours: 1.5,
        totalHours: 22.5,
        groupCount: 2,
        studentCount: 45,
        semester: 'S1',
        status: 'confirmed',
        assignedDate: new Date('2024-09-01')
      },
      {
        id: '3',
        moduleCode: 'STAT202',
        moduleName: 'Statistiques Descriptives',
        level: 'L2',
        formation: 'Sciences Économiques',
        type: 'CM',
        weeklyHours: 1.5,
        totalHours: 22.5,
        groupCount: 1,
        studentCount: 38,
        semester: 'S2',
        status: 'assigned',
        assignedDate: new Date('2024-09-15')
      },
      {
        id: '4',
        moduleCode: 'STAT202',
        moduleName: 'Statistiques Descriptives',
        level: 'L2',
        formation: 'Sciences Économiques',
        type: 'TD',
        weeklyHours: 1.5,
        totalHours: 22.5,
        groupCount: 2,
        studentCount: 38,
        semester: 'S2',
        status: 'pending',
        assignedDate: new Date('2024-09-15')
      },
      {
        id: '5',
        moduleCode: 'MATH101',
        moduleName: 'Mathématiques pour Économistes',
        level: 'L1',
        formation: 'Sciences Économiques',
        type: 'TD',
        weeklyHours: 1.5,
        totalHours: 22.5,
        groupCount: 3,
        studentCount: 67,
        semester: 'S1',
        status: 'confirmed',
        assignedDate: new Date('2024-08-20')
      }
    ];

    setAssignments(mockAssignments);
    
    // Calcul du résumé de charge
    const totalHours = mockAssignments.reduce((sum, assignment) => 
      sum + assignment.totalHours * assignment.groupCount, 0
    );
    
    const bySemester = mockAssignments.reduce((acc, assignment) => {
      acc[assignment.semester] += assignment.totalHours * assignment.groupCount;
      return acc;
    }, { S1: 0, S2: 0 });

    const byType = mockAssignments.reduce((acc, assignment) => {
      acc[assignment.type] += assignment.totalHours * assignment.groupCount;
      return acc;
    }, { CM: 0, TD: 0, TP: 0 });

    const percentage = (totalHours / 180) * 100;
    const status = percentage < 80 ? 'under' : percentage > 110 ? 'over' : 'normal';

    setWorkloadSummary({
      totalHours,
      maxHours: 180,
      percentage,
      status,
      bySemester,
      byType
    });
  }, []);

  const confirmAssignment = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'confirmed' as const }
          : assignment
      )
    );

    toast({
      title: "Charge confirmée",
      description: "L'attribution a été confirmée avec succès"
    });
  };

  const rejectAssignment = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: 'rejected' as const }
          : assignment
      )
    );

    toast({
      title: "Charge refusée",
      description: "L'attribution a été refusée. L'administration en sera informée."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800">Assignée</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getWorkloadStatusColor = (status: string) => {
    switch (status) {
      case 'under': return 'text-amber-600';
      case 'normal': return 'text-green-600';
      case 'over': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getWorkloadStatusText = (status: string) => {
    switch (status) {
      case 'under': return 'Sous-charge';
      case 'normal': return 'Charge normale';
      case 'over': return 'Surcharge';
      default: return 'Indéfini';
    }
  };

  const filteredAssignments = selectedSemester === 'all' 
    ? assignments 
    : assignments.filter(assignment => assignment.semester === selectedSemester);

  const exportWorkload = () => {
    toast({
      title: "Export en cours",
      description: "Votre relevé de charges sera téléchargé dans quelques instants"
    });
  };

  return (
    <div className="space-y-6">
      {/* Résumé de la charge */}
      <Card className="border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <BarChart3 className="h-5 w-5" />
            Résumé de ma Charge Pédagogique - {selectedAcademicYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-800">{workloadSummary.totalHours}h</p>
              <p className="text-sm text-blue-700">Total annuel</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-800">{workloadSummary.maxHours}h</p>
              <p className="text-sm text-green-700">Charge max</p>
            </div>

            <div className={`text-center p-4 rounded-lg border ${
              workloadSummary.status === 'over' ? 'bg-red-50 border-red-200' :
              workloadSummary.status === 'under' ? 'bg-amber-50 border-amber-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className={`h-8 w-8 mx-auto mb-2 flex items-center justify-center ${getWorkloadStatusColor(workloadSummary.status)}`}>
                {workloadSummary.status === 'over' ? <AlertTriangle className="h-8 w-8" /> : 
                 workloadSummary.status === 'under' ? <Clock className="h-8 w-8" /> :
                 <CheckCircle className="h-8 w-8" />}
              </div>
              <p className={`text-2xl font-bold ${getWorkloadStatusColor(workloadSummary.status)}`}>
                {workloadSummary.percentage.toFixed(1)}%
              </p>
              <p className={`text-sm ${getWorkloadStatusColor(workloadSummary.status)}`}>
                {getWorkloadStatusText(workloadSummary.status)}
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-800">{assignments.length}</p>
              <p className="text-sm text-purple-700">Attributions</p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression de la charge</span>
              <span className="text-sm text-gray-500">
                {workloadSummary.totalHours}h / {workloadSummary.maxHours}h
              </span>
            </div>
            <Progress 
              value={workloadSummary.percentage} 
              className={`h-3 ${
                workloadSummary.status === 'over' ? '[&>div]:bg-red-500' :
                workloadSummary.status === 'under' ? '[&>div]:bg-amber-500' :
                '[&>div]:bg-green-500'
              }`}
            />
          </div>

          {/* Répartition par semestre et type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Répartition par semestre</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Semestre 1</span>
                  <Badge variant="outline">{workloadSummary.bySemester.S1}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Semestre 2</span>
                  <Badge variant="outline">{workloadSummary.bySemester.S2}h</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Répartition par type</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cours Magistraux (CM)</span>
                  <Badge variant="outline">{workloadSummary.byType.CM}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Travaux Dirigés (TD)</span>
                  <Badge variant="outline">{workloadSummary.byType.TD}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Travaux Pratiques (TP)</span>
                  <Badge variant="outline">{workloadSummary.byType.TP}h</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mes Attributions de Charges</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedSemester} onValueChange={(value: any) => setSelectedSemester(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les semestres</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportWorkload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{assignment.moduleName}</h4>
                      <Badge variant="outline">{assignment.moduleCode}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">{assignment.type}</Badge>
                      <Badge variant="outline">{assignment.semester}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Formation:</span> {assignment.formation} {assignment.level}</p>
                      <p><span className="font-medium">Charge:</span> {assignment.weeklyHours}h/semaine × {assignment.groupCount} groupe(s) = {assignment.totalHours * assignment.groupCount}h total</p>
                      <p><span className="font-medium">Étudiants:</span> {assignment.studentCount}</p>
                      <p><span className="font-medium">Date d'attribution:</span> {assignment.assignedDate.toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(assignment.status)}
                  </div>
                </div>

                {(assignment.status === 'assigned' || assignment.status === 'pending') && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button 
                      size="sm" 
                      onClick={() => confirmAssignment(assignment.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => rejectAssignment(assignment.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Refuser
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredAssignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune attribution trouvée pour cette période</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
