import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Award, Calendar, FileText, 
  BarChart3, PieChart as PieChartIcon, Target, AlertTriangle,
  Download, Filter, Plus, Eye
} from "lucide-react";
import { statisticsService } from "@/services/statisticsService";
import { useToast } from "@/hooks/use-toast";

interface DailyStatistic {
  id: string;
  date: Date;
  totalStaff: number;
  presentStaff: number;
  absentStaff: number;
  newHires: number;
  departures: number;
  promotions: number;
  completedTasks: number;
  pendingTasks: number;
  createdBy: string;
  createdAt: Date;
}

interface AnalysisResult {
  trend: 'increasing' | 'decreasing' | 'stable';
  percentage: number;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

export const AdvancedStatistics = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatistic[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [analysisType, setAnalysisType] = useState("global");
  const [loading, setLoading] = useState(true);
  const [showDataEntry, setShowDataEntry] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
    loadDailyStatistics();
  }, [selectedPeriod]);

  const loadStatistics = async () => {
    try {
      const data = await statisticsService.getGlobalStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    }
  };

  const loadDailyStatistics = () => {
    // Simulation de données quotidiennes pour les derniers jours
    const days = parseInt(selectedPeriod);
    const mockData: DailyStatistic[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockData.push({
        id: `stat-${i}`,
        date,
        totalStaff: 150 + Math.floor(Math.random() * 10) - 5,
        presentStaff: 135 + Math.floor(Math.random() * 20) - 10,
        absentStaff: 15 + Math.floor(Math.random() * 10) - 5,
        newHires: Math.floor(Math.random() * 3),
        departures: Math.floor(Math.random() * 2),
        promotions: Math.floor(Math.random() * 2),
        completedTasks: 8 + Math.floor(Math.random() * 12),
        pendingTasks: 5 + Math.floor(Math.random() * 8),
        createdBy: 'system',
        createdAt: date
      });
    }
    
    setDailyStats(mockData);
    setLoading(false);
  };

  const analyzeData = (data: DailyStatistic[], metric: string): AnalysisResult => {
    if (data.length < 2) {
      return {
        trend: 'stable',
        percentage: 0,
        recommendation: 'Données insuffisantes pour l\'analyse',
        priority: 'low'
      };
    }

    const recent = data.slice(-7); // 7 derniers jours
    const previous = data.slice(-14, -7); // 7 jours précédents
    
    const recentAvg = recent.reduce((sum, item) => sum + (item as any)[metric], 0) / recent.length;
    const previousAvg = previous.length > 0 
      ? previous.reduce((sum, item) => sum + (item as any)[metric], 0) / previous.length
      : recentAvg;

    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'low';
    let recommendation = '';

    if (Math.abs(change) < 5) {
      trend = 'stable';
      recommendation = `${metric} stable sur la période`;
    } else if (change > 0) {
      trend = 'increasing';
      if (metric === 'absentStaff' || metric === 'pendingTasks') {
        priority = change > 20 ? 'urgent' : change > 10 ? 'high' : 'medium';
        recommendation = `Augmentation préoccupante de ${metric}. Action recommandée.`;
      } else {
        recommendation = `Tendance positive pour ${metric}`;
      }
    } else {
      trend = 'decreasing';
      if (metric === 'presentStaff' || metric === 'completedTasks') {
        priority = Math.abs(change) > 20 ? 'urgent' : Math.abs(change) > 10 ? 'high' : 'medium';
        recommendation = `Baisse préoccupante de ${metric}. Investigation nécessaire.`;
      } else {
        recommendation = `Amélioration observée pour ${metric}`;
      }
    }

    return {
      trend,
      percentage: Math.abs(change),
      recommendation,
      priority
    };
  };

  const getMetricIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const exportData = () => {
    const csvData = dailyStats.map(stat => ({
      Date: stat.date.toISOString().split('T')[0],
      'Personnel Total': stat.totalStaff,
      'Personnel Présent': stat.presentStaff,
      'Personnel Absent': stat.absentStaff,
      'Nouvelles Embauches': stat.newHires,
      'Départs': stat.departures,
      'Promotions': stat.promotions,
      'Tâches Complétées': stat.completedTasks,
      'Tâches En Attente': stat.pendingTasks
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statistiques-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = dailyStats.map(stat => ({
    date: stat.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    present: stat.presentStaff,
    absent: stat.absentStaff,
    tasks: stat.completedTasks,
    pending: stat.pendingTasks
  }));

  const analysisResults = {
    presentStaff: analyzeData(dailyStats, 'presentStaff'),
    absentStaff: analyzeData(dailyStats, 'absentStaff'),
    completedTasks: analyzeData(dailyStats, 'completedTasks'),
    pendingTasks: analyzeData(dailyStats, 'pendingTasks')
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <Card className="border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistiques Avancées et Aide à la Décision
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDataEntry(!showDataEntry)}>
                <Plus className="h-4 w-4 mr-2" />
                Saisir Données
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Période:</span>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="90">90 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Analyse:</span>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Vue Globale</SelectItem>
                  <SelectItem value="department">Par Département</SelectItem>
                  <SelectItem value="grade">Par Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Métriques clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Personnel Présent</p>
                    <p className="text-2xl font-bold">{dailyStats[dailyStats.length - 1]?.presentStaff || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  {getMetricIcon(analysisResults.presentStaff.trend)}
                  <span>{analysisResults.presentStaff.percentage.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taux d'Absence</p>
                    <p className="text-2xl font-bold">
                      {((dailyStats[dailyStats.length - 1]?.absentStaff || 0) / 
                        (dailyStats[dailyStats.length - 1]?.totalStaff || 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  {getMetricIcon(analysisResults.absentStaff.trend)}
                  <span>{analysisResults.absentStaff.percentage.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tâches Complétées</p>
                    <p className="text-2xl font-bold">{dailyStats[dailyStats.length - 1]?.completedTasks || 0}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  {getMetricIcon(analysisResults.completedTasks.trend)}
                  <span>{analysisResults.completedTasks.percentage.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Efficacité</p>
                    <p className="text-2xl font-bold">
                      {((dailyStats[dailyStats.length - 1]?.completedTasks || 0) / 
                        ((dailyStats[dailyStats.length - 1]?.completedTasks || 0) + 
                         (dailyStats[dailyStats.length - 1]?.pendingTasks || 1)) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du Personnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />
                    <Area type="monotone" dataKey="absent" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance des Tâches</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analysisResults).map(([key, result]) => (
              <Card key={key} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getMetricIcon(result.trend)}
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Variation:</span>
                      <Badge variant="outline" className={`${result.trend === 'increasing' ? 'text-green-700' : result.trend === 'decreasing' ? 'text-red-700' : 'text-gray-700'}`}>
                        {result.trend === 'increasing' ? '+' : result.trend === 'decreasing' ? '-' : ''}
                        {result.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Recommandation:</span>
                      <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                    </div>
                    <Badge className={getPriorityColor(result.priority)}>
                      Priorité: {result.priority.charAt(0).toUpperCase() + result.priority.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Graphiques de tendances détaillés */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Tendances Détaillée</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={3} />
                  <Line type="monotone" dataKey="absent" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line type="monotone" dataKey="tasks" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prédictions et Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Prochaine Semaine</h4>
                    <p className="text-sm text-muted-foreground">
                      Basé sur les tendances actuelles, on prévoit une présence moyenne de{' '}
                      <span className="font-semibold text-primary">
                        {Math.round(dailyStats.slice(-7).reduce((sum, stat) => sum + stat.presentStaff, 0) / 7)}
                      </span> personnes.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Risques Identifiés</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysisResults.absentStaff.priority === 'high' || analysisResults.absentStaff.priority === 'urgent'
                        ? 'Taux d\'absence élevé nécessitant une attention immédiate'
                        : 'Aucun risque majeur identifié'}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Actions Recommandées</h4>
                    <p className="text-sm text-muted-foreground">
                      Renforcer le suivi des absences et optimiser la répartition des tâches.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};