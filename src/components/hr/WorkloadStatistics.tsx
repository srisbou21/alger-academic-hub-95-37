
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock } from "lucide-react";
import { WorkloadStatistics as WorkloadStatsType } from "../../types/teacher";
import { teacherService } from "../../services/teacherService";
import { useToast } from "@/hooks/use-toast";
import { WorkloadFilters } from "./workload/WorkloadFilters";
import { WorkloadOverview } from "./workload/WorkloadOverview";
import { WorkloadByGrade } from "./workload/WorkloadByGrade";
import { WorkloadAlerts } from "./workload/WorkloadAlerts";

export const WorkloadStatistics = () => {
  const [statistics, setStatistics] = useState<WorkloadStatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("Informatique");
  const [selectedSemester, setSelectedSemester] = useState<'S1' | 'S2'>('S1');
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, [selectedDepartment, selectedSemester, selectedYear]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const stats = await teacherService.getWorkloadStatistics(
        selectedDepartment,
        selectedSemester,
        selectedYear
      );
      setStatistics(stats);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques de charge pédagogique",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport est en cours de génération..."
    });
    // Simulation d'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Le rapport PDF a été téléchargé avec succès"
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Système de Statistiques des Charges Pédagogiques
          </CardTitle>
          <p className="text-blue-100">
            Analysez la répartition des charges et identifiez les déséquilibres pédagogiques
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <WorkloadFilters
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            onExportReport={exportReport}
          />
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-slate-500">Chargement des statistiques...</p>
        </div>
      ) : statistics ? (
        <>
          <WorkloadOverview statistics={statistics} />
          <WorkloadByGrade statistics={statistics} />
          <WorkloadAlerts alerts={statistics.alerts} />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500">Sélectionnez un département pour voir les statistiques</p>
        </div>
      )}
    </div>
  );
};
