
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { WorkloadAssignmentManager } from "./WorkloadAssignmentManager";
import { WorkloadStatisticsView } from "./WorkloadStatisticsView";
import { TeacherWorkload, WorkloadStatistics } from "../../types/workload";
import { workloadService } from "../../services/workloadService";
import { useToast } from "@/hooks/use-toast";

interface WorkloadManagementProps {
  academicYear?: string;
}

export const WorkloadManagement = ({ academicYear = "2024-2025" }: WorkloadManagementProps) => {
  const { toast } = useToast();
  const [workloads, setWorkloads] = useState<TeacherWorkload[]>([]);
  const [statistics, setStatistics] = useState<WorkloadStatistics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkloadData();
  }, [academicYear]);

  const loadWorkloadData = async () => {
    setLoading(true);
    try {
      const [workloadData, statsData] = await Promise.all([
        workloadService.getTeacherWorkloads(academicYear),
        workloadService.getWorkloadStatistics("Informatique", academicYear)
      ]);
      setWorkloads(workloadData);
      setStatistics(statsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de charge d'enseignement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWorkloadUpdate = () => {
    loadWorkloadData();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des données...</p>
        </CardContent>
      </Card>
    );
  }

  const getOverviewStats = () => {
    const totalTeachers = workloads.length;
    const overloadedTeachers = workloads.filter(w => w.status === 'overload').length;
    const underloadedTeachers = workloads.filter(w => w.status === 'underload').length;
    const totalHours = workloads.reduce((sum, w) => sum + w.totalHours, 0);
    
    return { totalTeachers, overloadedTeachers, underloadedTeachers, totalHours };
  };

  const stats = getOverviewStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Charges d'Enseignement</h2>
          <p className="text-slate-600">Année académique: {academicYear}</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Clock className="h-3 w-3 mr-1" />
          {stats.totalHours}h Total
        </Badge>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Enseignants</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalTeachers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Heures Totales</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Surcharges</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.overloadedTeachers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Sous-charges</p>
                <p className="text-2xl font-bold text-purple-900">{stats.underloadedTeachers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Attribution des Charges</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques Détaillées</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <WorkloadAssignmentManager 
            academicYear={academicYear}
            onWorkloadUpdate={handleWorkloadUpdate}
          />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          {statistics ? (
            <WorkloadStatisticsView statistics={statistics} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-600">Aucune statistique disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
