import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Award, TrendingUp, Clock, Target, Star } from "lucide-react";
import { statisticsService, GlobalStatistics } from "@/services/statisticsService";
import { useToast } from "@/hooks/use-toast";

export const AdministrativeStatistics = () => {
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
      console.error("Erreur lors du chargement des statistiques administratives:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques administratives",
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

  const adminStats = statistics.administrativeStatistics;

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Personnel</p>
                <p className="text-3xl font-bold text-blue-600">{adminStats.totalStaff}</p>
                <p className="text-xs text-slate-500 mt-1">Personnel administratif</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Performance Moyenne</p>
                <p className="text-3xl font-bold text-green-600">{adminStats.averagePerformanceScore.toFixed(1)}/20</p>
                <p className="text-xs text-slate-500 mt-1">Dernière évaluation</p>
              </div>
              <Star className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Taux de Completion</p>
                <p className="text-3xl font-bold text-purple-600">{statistics.taskCompletionRate.toFixed(1)}%</p>
                <p className="text-xs text-slate-500 mt-1">Tâches administratives</p>
              </div>
              <Target className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Compétences</p>
                <p className="text-3xl font-bold text-orange-600">{Object.keys(adminStats.skillCoverage).length}</p>
                <p className="text-xs text-slate-500 mt-1">Compétences couvertes</p>
              </div>
              <Award className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par service et poste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition par Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(adminStats.byService).map(([service, count]) => (
                <div key={service} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{service}</span>
                    <span className="text-sm text-slate-600">{count} personnes</span>
                  </div>
                  <Progress 
                    value={(count / adminStats.totalStaff) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition par Poste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(adminStats.byPosition).map(([position, count]) => (
                <div key={position} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{position}</span>
                    <span className="text-sm text-slate-600">{count} personnes</span>
                  </div>
                  <Progress 
                    value={(count / adminStats.totalStaff) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compétences clés */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Compétences Clés Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(adminStats.skillCoverage)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([skill, count]) => (
                <div key={skill} className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">{skill}</p>
                  <p className="text-xs text-slate-600 mt-1">{count} personnes</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};