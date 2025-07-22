
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Briefcase, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { statisticsService, GlobalStatistics } from "@/services/statisticsService";
import { useToast } from "@/hooks/use-toast";

interface HRStatisticsProps {
  totalStaff?: number;
  totalTeachers?: number;
  totalAdministrative?: number;
  absenceRate?: number;
  taskCompletionRate?: number;
  upcomingRetirements?: number;
  useRealData?: boolean;
}

export const HRStatistics: React.FC<HRStatisticsProps> = ({
  totalStaff: propTotalStaff,
  totalTeachers: propTotalTeachers,
  totalAdministrative: propTotalAdministrative,
  absenceRate: propAbsenceRate,
  taskCompletionRate: propTaskCompletionRate,
  upcomingRetirements: propUpcomingRetirements,
  useRealData = true
}) => {
  const [statistics, setStatistics] = useState<GlobalStatistics | null>(null);
  const [loading, setLoading] = useState(useRealData);
  const { toast } = useToast();

  useEffect(() => {
    if (useRealData) {
      loadStatistics();
    }
  }, [useRealData]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await statisticsService.getGlobalStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques HR:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques HR",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Utiliser les vraies données si disponibles, sinon les props
  const totalStaff = useRealData ? (statistics?.totalStaff || 0) : (propTotalStaff || 0);
  const totalTeachers = useRealData ? (statistics?.totalTeachers || 0) : (propTotalTeachers || 0);
  const totalAdministrative = useRealData ? (statistics?.totalAdministrative || 0) : (propTotalAdministrative || 0);
  const absenceRate = useRealData ? (statistics?.absenceRate || 0) : (propAbsenceRate || 0);
  const taskCompletionRate = useRealData ? (statistics?.taskCompletionRate || 0) : (propTaskCompletionRate || 0);
  const upcomingRetirements = useRealData ? (statistics?.upcomingRetirements || 0) : (propUpcomingRetirements || 0);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Personnel</p>
              <p className="text-2xl font-bold">{totalStaff}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Enseignants</p>
              <p className="text-2xl font-bold">{totalTeachers}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Administratif</p>
              <p className="text-2xl font-bold">{totalAdministrative}</p>
            </div>
            <Briefcase className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux d'absence</p>
              <p className="text-2xl font-bold">{absenceRate.toFixed(1)}%</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tâches complétées</p>
              <p className="text-2xl font-bold">{taskCompletionRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Retraites prochaines</p>
              <p className="text-2xl font-bold">{upcomingRetirements}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
