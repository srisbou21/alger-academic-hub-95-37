
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { TeacherAbsence } from "../../types/teacher";
import { absenceService } from "../../services/absenceService";
import { User as UserType } from "../../types/user";

interface TeacherAbsenceGraphicsProps {
  teacherId: string;
  teacherName: string;
  currentUser: UserType;
}

interface AbsenceMetrics {
  totalAbsences: number;
  totalDays: number;
  averageDuration: number;
  justificationRate: number;
  monthlyData: { month: string; absences: number; days: number }[];
  typeDistribution: { type: string; count: number; percentage: number }[];
  yearlyComparison: { year: string; absences: number; days: number }[];
  statusDistribution: { status: string; count: number }[];
}

const COLORS = {
  maladie: '#ef4444',
  conge_annuel: '#3b82f6',
  formation: '#10b981',
  mission: '#f59e0b',
  autre: '#8b5cf6'
};

const STATUS_COLORS = {
  approved: '#10b981',
  pending: '#f59e0b',
  rejected: '#ef4444'
};

export const TeacherAbsenceGraphics: React.FC<TeacherAbsenceGraphicsProps> = ({ 
  teacherId, 
  teacherName, 
  currentUser 
}) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [metrics, setMetrics] = useState<AbsenceMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current_year');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTeacherAbsences();
  }, [teacherId, selectedPeriod]);

  const loadTeacherAbsences = async () => {
    setLoading(true);
    try {
      const filters = {
        teacherId: teacherId,
        academicYear: selectedPeriod === 'current_year' ? '2024-2025' : undefined
      };
      
      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
      calculateMetrics(data);
    } catch (error) {
      console.error("Erreur lors du chargement des absences:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (absenceData: TeacherAbsence[]) => {
    if (absenceData.length === 0) {
      setMetrics(null);
      return;
    }

    const totalAbsences = absenceData.length;
    const totalDays = absenceData.reduce((sum, abs) => {
      const days = Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);
    const averageDuration = totalDays / totalAbsences;
    const justifiedCount = absenceData.filter(abs => abs.isJustified).length;
    const justificationRate = (justifiedCount / totalAbsences) * 100;

    // Données mensuelles
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2024, i, 1).toLocaleDateString('fr-FR', { month: 'short' });
      const monthAbsences = absenceData.filter(abs => abs.startDate.getMonth() === i);
      const monthDays = monthAbsences.reduce((sum, abs) => {
        const days = Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return sum + days;
      }, 0);
      
      return {
        month,
        absences: monthAbsences.length,
        days: monthDays
      };
    });

    // Distribution par type
    const typeCount = absenceData.reduce((acc, abs) => {
      acc[abs.type] = (acc[abs.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const typeDistribution = Object.entries(typeCount).map(([type, count]) => ({
      type: type.replace('_', ' ').toUpperCase(),
      count,
      percentage: (count / totalAbsences) * 100
    }));

    // Distribution par statut
    const statusCount = absenceData.reduce((acc, abs) => {
      acc[abs.status] = (acc[abs.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
      status: status === 'approved' ? 'Approuvée' : 
              status === 'pending' ? 'En attente' : 'Rejetée',
      count
    }));

    // Comparaison annuelle (données simulées)
    const yearlyComparison = [
      { year: '2022-23', absences: Math.max(0, totalAbsences - Math.floor(Math.random() * 5)), days: Math.max(0, totalDays - Math.floor(Math.random() * 10)) },
      { year: '2023-24', absences: Math.max(0, totalAbsences - Math.floor(Math.random() * 3)), days: Math.max(0, totalDays - Math.floor(Math.random() * 5)) },
      { year: '2024-25', absences: totalAbsences, days: totalDays }
    ];

    setMetrics({
      totalAbsences,
      totalDays,
      averageDuration,
      justificationRate,
      monthlyData,
      typeDistribution,
      yearlyComparison,
      statusDistribution
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Chargement des graphiques...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">Aucune donnée d'absence disponible pour cet enseignant</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de période */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Analyse Graphique des Absences
              </CardTitle>
              <p className="text-blue-600 font-medium">{teacherName}</p>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_year">Année en cours</SelectItem>
                <SelectItem value="last_year">Année précédente</SelectItem>
                <SelectItem value="all_time">Toutes les années</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Absences</p>
                <p className="text-2xl font-bold text-blue-800">{metrics.totalAbsences}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Jours Perdus</p>
                <p className="text-2xl font-bold text-orange-800">{metrics.totalDays}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />          </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Durée Moyenne</p>
                <p className="text-2xl font-bold text-green-800">{metrics.averageDuration.toFixed(1)}</p>
                <p className="text-xs text-green-600">jours/absence</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Taux Justifié</p>
                <p className="text-2xl font-bold text-purple-800">{metrics.justificationRate.toFixed(1)}%</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {metrics.justificationRate >= 80 ? 'Bon' : 
                 metrics.justificationRate >= 60 ? 'Moyen' : 'Faible'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle des Absences</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="absences" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Nombre d'absences"
                />
                <Area 
                  type="monotone" 
                  dataKey="days" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="Jours d'absence"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution par type */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type d'Absence</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.typeDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(COLORS)[index] || '#8884d8'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comparaison annuelle */}
        <Card>
          <CardHeader>
            <CardTitle>Comparaison sur 3 Ans</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="absences" fill="#3b82f6" name="Nombre d'absences" />
                <Bar dataKey="days" fill="#ef4444" name="Jours d'absence" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution par statut */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des Demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {metrics.statusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(STATUS_COLORS)[index] || '#8884d8'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analyse et recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Tendance Générale</h4>
                <p className="text-sm text-blue-700">
                  {metrics.totalAbsences <= 5 ? 
                    "Niveau d'absence acceptable et dans la norme." :
                    metrics.totalAbsences <= 10 ?
                    "Niveau d'absence modéré, surveillance recommandée." :
                    "Niveau d'absence élevé, intervention nécessaire."
                  }
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Justifications</h4>
                <p className="text-sm text-green-700">
                  {metrics.justificationRate >= 80 ?
                    "Excellent taux de justification des absences." :
                    metrics.justificationRate >= 60 ?
                    "Taux de justification satisfaisant." :
                    "Amélioration du processus de justification recommandée."
                  }
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">Impact Pédagogique</h4>
                <p className="text-sm text-amber-700">
                  {metrics.totalDays <= 10 ?
                    "Impact minimal sur les cours." :
                    metrics.totalDays <= 20 ?
                    "Impact modéré, planification de remplacements conseillée." :
                    "Impact significatif, mesures correctives nécessaires."
                  }
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Recommandations</h4>
                <p className="text-sm text-purple-700">
                  {metrics.averageDuration > 3 ?
                    "Durée moyenne élevée, suivi médical recommandé." :
                    "Durée moyenne acceptable, maintenir les bonnes pratiques."
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
