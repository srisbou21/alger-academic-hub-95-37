
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users, AlertTriangle, Download } from "lucide-react";
import { AbsenceStatistics as AbsenceStatsType } from "../../types/teacher";
import { teacherService } from "../../services/teacherService";
import { useToast } from "@/hooks/use-toast";

export const AbsenceStatistics = () => {
  const [statistics, setStatistics] = useState<AbsenceStatsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod, selectedDepartment]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const data = await teacherService.getAbsenceStatistics();
      setStatistics(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques d'absence",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast({
      title: "Export en cours",
      description: "Le rapport d'absences est en cours d'export..."
    });
  };

  const totalAbsences = statistics.reduce((sum, stat) => sum + stat.absencesSummary.totalAbsences, 0);
  const totalDays = statistics.reduce((sum, stat) => sum + stat.absencesSummary.totalDays, 0);
  const averageRate = statistics.length > 0 ? totalDays / statistics.length : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Statistiques des Absences
          </CardTitle>
          <p className="text-slate-600">
            Analyse détaillée des absences du personnel enseignant et administratif
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_month">Mois actuel</SelectItem>
                <SelectItem value="last_month">Mois dernier</SelectItem>
                <SelectItem value="current_semester">Semestre actuel</SelectItem>
                <SelectItem value="academic_year">Année académique</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="informatique">Informatique</SelectItem>
                <SelectItem value="mathematiques">Mathématiques</SelectItem>
                <SelectItem value="physique">Physique</SelectItem>
                <SelectItem value="chimie">Chimie</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalAbsences}</p>
              <p className="text-sm text-blue-800">Total Absences</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{totalDays}</p>
              <p className="text-sm text-orange-800">Jours d'absence</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{averageRate.toFixed(1)}</p>
              <p className="text-sm text-green-800">Moyenne par personne</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {statistics.filter(s => s.trend.riskLevel === 'high').length}
              </p>
              <p className="text-sm text-red-800">Cas à surveiller</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste détaillée */}
      <Card>
        <CardHeader>
          <CardTitle>Détail par Enseignant</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-slate-500">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statistics.map((stat) => (
                <div key={stat.teacherId} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{stat.teacherName}</h3>
                      <p className="text-sm text-slate-600">
                        {stat.period.startDate.toLocaleDateString()} - {stat.period.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      stat.trend.riskLevel === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : stat.trend.riskLevel === 'medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {stat.trend.riskLevel === 'high' ? 'Risque élevé' : 
                       stat.trend.riskLevel === 'medium' ? 'Surveillance' : 'Normal'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Résumé des absences</p>
                      <div className="text-sm text-slate-600">
                        <p>Total: {stat.absencesSummary.totalAbsences} absences</p>
                        <p>Jours: {stat.absencesSummary.totalDays} jours</p>
                        <p>Justifiées: {stat.absencesSummary.justified}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Impact</p>
                      <div className="text-sm text-slate-600">
                        <p>Cours impactés: {stat.impact.coursesImpacted}</p>
                        <p>Étudiants affectés: {stat.impact.studentsAffected}</p>
                        <p>Heures perdues: {stat.impact.hoursLost}h</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Types d'absence</p>
                      <div className="space-y-1">
                        {Object.entries(stat.absencesSummary.byType).map(([type, data]) => (
                          <div key={type} className="flex justify-between text-sm">
                            <span className="capitalize">{type.replace('_', ' ')}</span>
                            <span>{data.count} ({data.percentage.toFixed(1)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
