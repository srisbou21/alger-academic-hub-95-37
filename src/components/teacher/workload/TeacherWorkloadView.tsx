import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Users, AlertTriangle } from "lucide-react";

interface TeacherWithWorkload {
  id: string;
  name: string;
  grade: string;
  department: string;
  specialty: string;
  isActive: boolean;
  assignments: WorkloadAssignment[];
  totalHours: number;
  maxHours: number;
  status: 'normal' | 'overload' | 'underload';
}

interface WorkloadAssignment {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  specialtyId: string;
  specialtyName: string;
  semester: 'S1' | 'S2' | 'Année';
  atomType: 'cours' | 'td' | 'tp';
  targetAudience: {
    type: 'section' | 'group';
    id: string;
    name: string;
    capacity: number;
  };
  hoursPerWeek: number;
  totalHours: number;
  isConfirmed: boolean;
}

interface TeacherWorkloadViewProps {
  teachers: TeacherWithWorkload[];
  loading: boolean;
}

export const TeacherWorkloadView: React.FC<TeacherWorkloadViewProps> = ({
  teachers,
  loading
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Aucun enseignant trouvé</p>
          <p className="text-slate-500 text-sm mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overload':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'underload':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overload':
        return <AlertTriangle className="h-4 w-4" />;
      case 'underload':
        return <Clock className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overload':
        return 'Surcharge';
      case 'underload':
        return 'Sous-charge';
      default:
        return 'Normal';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Charges Pédagogiques ({teachers.length} enseignant{teachers.length > 1 ? 's' : ''})
          </h3>
          <p className="text-slate-600 text-sm">
            Vue détaillée des attributions par enseignant
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => {
          const workloadPercentage = Math.round((teacher.totalHours / teacher.maxHours) * 100);
          const progressColor = getProgressColor(workloadPercentage);
          
          return (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <p className="text-sm text-slate-500">{teacher.grade}</p>
                    <p className="text-xs text-slate-500">
                      {teacher.department} • {teacher.specialty}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={teacher.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {teacher.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                    <Badge
                      className={`text-xs ${getStatusColor(teacher.status)}`}
                      variant="outline"
                    >
                      {getStatusIcon(teacher.status)}
                      <span className="ml-1">{getStatusText(teacher.status)}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Charge horaire globale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Charge horaire
                    </span>
                    <span className="font-medium">
                      {teacher.totalHours}h / {teacher.maxHours}h
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(workloadPercentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{workloadPercentage}% de la charge</span>
                    {workloadPercentage > 100 && (
                      <span className="text-red-600 font-medium">
                        +{teacher.totalHours - teacher.maxHours}h
                      </span>
                    )}
                  </div>
                </div>

                {/* Liste des attributions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    Attributions ({teacher.assignments.length})
                  </h4>
                  
                  {teacher.assignments.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {teacher.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="p-2 bg-slate-50 rounded-md border-l-4 border-blue-200"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {assignment.moduleName}
                              </p>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  assignment.atomType === 'cours' ? 'bg-blue-100 text-blue-800' :
                                  assignment.atomType === 'td' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {assignment.atomType.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-600 space-y-1">
                              <p>📚 {assignment.specialtyName} • {assignment.semester}</p>
                              <p>👥 {assignment.targetAudience.name}</p>
                              <p>⏰ {assignment.hoursPerWeek}h/sem • {assignment.totalHours}h total</p>
                            </div>
                            {!assignment.isConfirmed && (
                              <Badge variant="outline" className="text-xs text-orange-600">
                                En attente
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-2">
                      Aucune attribution pour le moment
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};