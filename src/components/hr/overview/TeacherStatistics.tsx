import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, TrendingUp, Users, Calendar, Award, AlertTriangle } from "lucide-react";
import { statisticsService, GlobalStatistics } from "@/services/statisticsService";
import { useToast } from "@/hooks/use-toast";

export const TeacherStatistics = () => {
  const [statistics, setStatistics] = useState<GlobalStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await statisticsService.getGlobalStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques enseignants:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques enseignants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
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

  if (!statistics) return null;

  const teacherStats = statistics.teacherStatistics;

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Enseignants</p>
                <p className="text-3xl font-bold text-blue-600">{teacherStats.totalTeachers}</p>
                <p className="text-xs text-slate-500 mt-1">Corps enseignant</p>
              </div>
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Échelon Moyen</p>
                <p className="text-3xl font-bold text-green-600">{teacherStats.averageEchelon.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">Progression carrière</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Expérience Moyenne</p>
                <p className="text-3xl font-bold text-purple-600">{teacherStats.averageExperience.toFixed(1)} ans</p>
                <p className="text-xs text-slate-500 mt-1">Ancienneté moyenne</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Promotions Dues</p>
                <p className="text-3xl font-bold text-orange-600">{teacherStats.promotionsDue}</p>
                <p className="text-xs text-slate-500 mt-1">À traiter</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par grade */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Répartition par Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(teacherStats.byGrade)
              .sort(([,a], [,b]) => b - a)
              .map(([grade, count]) => (
                <div key={grade} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{grade}</span>
                    <span className="text-sm text-slate-600">{count} enseignants</span>
                  </div>
                  <Progress 
                    value={(count / teacherStats.totalTeachers) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Enseignants Externes</p>
                <p className="text-2xl font-bold text-indigo-600">{teacherStats.externalTeachers}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {((teacherStats.externalTeachers / teacherStats.totalTeachers) * 100).toFixed(1)}% du corps
                </p>
              </div>
              <Users className="h-10 w-10 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Taux d'Absence</p>
                <p className="text-2xl font-bold text-amber-600">{statistics.absenceRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500 mt-1">Moyenne mensuelle</p>
              </div>
              <Calendar className="h-10 w-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Retraites Prochaines</p>
                <p className="text-2xl font-bold text-red-600">{statistics.upcomingRetirements}</p>
                <p className="text-xs text-slate-500 mt-1">Dans les 2 ans</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};