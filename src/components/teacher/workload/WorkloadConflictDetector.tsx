import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Users, Clock, RefreshCw } from "lucide-react";

interface WorkloadConflict {
  id: string;
  type: 'overload' | 'underload' | 'duplicate_assignment';
  severity: 'low' | 'medium' | 'high';
  teacherId?: string;
  teacherName?: string;
  moduleId?: string;
  moduleName?: string;
  targetId?: string;
  targetName?: string;
  description: string;
  details: string;
}

interface TeacherWithWorkload {
  id: string;
  name: string;
  grade: string;
  department: string;
  currentHours: number;
  maxHours: number;
  workloadPercentage: number;
  assignments: any[];
  status: 'normal' | 'overload' | 'underload';
}

interface WorkloadConflictDetectorProps {
  teachers: TeacherWithWorkload[];
  assignments: any[];
  onRefresh?: () => void;
}

export const WorkloadConflictDetector: React.FC<WorkloadConflictDetectorProps> = ({
  teachers,
  assignments,
  onRefresh
}) => {
  const [conflicts, setConflicts] = useState<WorkloadConflict[]>([]);
  const [underloadThreshold, setUnderloadThreshold] = useState([80]); // Pourcentage minimum
  const [overloadThreshold, setOverloadThreshold] = useState([100]); // Pourcentage maximum
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    detectConflicts();
  }, [teachers, assignments, underloadThreshold, overloadThreshold]);

  const detectConflicts = () => {
    const detectedConflicts: WorkloadConflict[] = [];

    // 1. Détecter les enseignants avec charge inférieure au seuil
    teachers.forEach(teacher => {
      if (teacher.workloadPercentage < underloadThreshold[0]) {
        detectedConflicts.push({
          id: `underload-${teacher.id}`,
          type: 'underload',
          severity: teacher.workloadPercentage < underloadThreshold[0] - 20 ? 'high' : 'medium',
          teacherId: teacher.id,
          teacherName: teacher.name,
          description: `Charge insuffisante: ${teacher.workloadPercentage.toFixed(1)}%`,
          details: `${teacher.name} a une charge de ${teacher.currentHours}h sur ${teacher.maxHours}h maximum (${teacher.workloadPercentage.toFixed(1)}%), inférieure au seuil de ${underloadThreshold[0]}%`
        });
      }
    });

    // 2. Détecter les enseignants avec surcharge
    teachers.forEach(teacher => {
      if (teacher.workloadPercentage > overloadThreshold[0]) {
        detectedConflicts.push({
          id: `overload-${teacher.id}`,
          type: 'overload',
          severity: teacher.workloadPercentage > overloadThreshold[0] + 20 ? 'high' : 'medium',
          teacherId: teacher.id,
          teacherName: teacher.name,
          description: `Surcharge détectée: ${teacher.workloadPercentage.toFixed(1)}%`,
          details: `${teacher.name} a une charge de ${teacher.currentHours}h sur ${teacher.maxHours}h maximum (${teacher.workloadPercentage.toFixed(1)}%), supérieure au seuil de ${overloadThreshold[0]}%`
        });
      }
    });

    // 3. Détecter les modules affectés plusieurs fois au même groupe/section
    const assignmentMap = new Map<string, any[]>();
    
    assignments.forEach(assignment => {
      const key = `${assignment.moduleId}-${assignment.targetAudience.id}-${assignment.atomType}`;
      if (!assignmentMap.has(key)) {
        assignmentMap.set(key, []);
      }
      assignmentMap.get(key)!.push(assignment);
    });

    assignmentMap.forEach((assignmentList, key) => {
      if (assignmentList.length > 1) {
        const [moduleId, targetId, atomType] = key.split('-');
        const assignment = assignmentList[0];
        const teacherNames = assignmentList.map(a => {
          const teacher = teachers.find(t => t.id === a.teacherId);
          return teacher?.name || 'Enseignant inconnu';
        }).join(', ');

        detectedConflicts.push({
          id: `duplicate-${key}`,
          type: 'duplicate_assignment',
          severity: 'high',
          moduleId: assignment.moduleId,
          moduleName: assignment.moduleName,
          targetId: assignment.targetAudience.id,
          targetName: assignment.targetAudience.name,
          description: `Module affecté ${assignmentList.length} fois`,
          details: `Le module "${assignment.moduleName}" (${atomType.toUpperCase()}) est affecté ${assignmentList.length} fois pour "${assignment.targetAudience.name}" par: ${teacherNames}`
        });
      }
    });

    setConflicts(detectedConflicts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overload':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'underload':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'duplicate_assignment':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'overload':
        return 'Surcharge';
      case 'underload':
        return 'Sous-charge';
      case 'duplicate_assignment':
        return 'Attribution multiple';
      default:
        return 'Conflit';
    }
  };

  const conflictsByType = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.type]) {
      acc[conflict.type] = [];
    }
    acc[conflict.type].push(conflict);
    return acc;
  }, {} as Record<string, WorkloadConflict[]>);

  const stats = {
    total: conflicts.length,
    overload: conflictsByType.overload?.length || 0,
    underload: conflictsByType.underload?.length || 0,
    duplicates: conflictsByType.duplicate_assignment?.length || 0,
    high: conflicts.filter(c => c.severity === 'high').length,
    medium: conflicts.filter(c => c.severity === 'medium').length,
    low: conflicts.filter(c => c.severity === 'low').length
  };

  return (
    <div className="space-y-6">
      {/* Configuration des seuils */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Configuration de la Détection de Conflits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Seuil de sous-charge (minimum) : {underloadThreshold[0]}%</Label>
              <Slider
                value={underloadThreshold}
                onValueChange={setUnderloadThreshold}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                Les enseignants avec moins de {underloadThreshold[0]}% de charge seront signalés
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Seuil de surcharge (maximum) : {overloadThreshold[0]}%</Label>
              <Slider
                value={overloadThreshold}
                onValueChange={setOverloadThreshold}
                max={150}
                min={80}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                Les enseignants avec plus de {overloadThreshold[0]}% de charge seront signalés
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-orange-200">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={detectConflicts}
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser la détection
              </Button>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  Recharger les données
                </Button>
              )}
            </div>
            <div className="text-sm text-orange-700">
              Dernière analyse: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques des conflits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.total}</div>
            <div className="text-sm text-red-500">Conflits totaux</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.underload}</div>
            <div className="text-sm text-yellow-500">Sous-charges</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overload}</div>
            <div className="text-sm text-red-500">Surcharges</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.duplicates}</div>
            <div className="text-sm text-purple-500">Attributions multiples</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des conflits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Conflits et Alertes Détectés ({conflicts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conflicts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-green-600">Aucun conflit détecté</p>
              <p className="text-sm">Toutes les attributions respectent les seuils configurés</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Sévérité</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead>Affecté</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conflicts.map((conflict) => (
                  <TableRow key={conflict.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(conflict.type)}
                        <span className="font-medium">{getTypeLabel(conflict.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(conflict.severity)}>
                        {conflict.severity === 'high' ? 'Élevée' : 
                         conflict.severity === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{conflict.description}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-md">{conflict.details}</p>
                    </TableCell>
                    <TableCell>
                      {conflict.teacherName && (
                        <div className="text-sm">
                          <p className="font-medium">{conflict.teacherName}</p>
                        </div>
                      )}
                      {conflict.moduleName && (
                        <div className="text-sm">
                          <p className="font-medium">{conflict.moduleName}</p>
                          {conflict.targetName && (
                            <p className="text-gray-500">{conflict.targetName}</p>
                          )}
                        </div>
                      )}
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