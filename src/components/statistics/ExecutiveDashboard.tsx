
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  GraduationCap, 
  DollarSign,
  BookOpen,
  Award,
  Building,
  FileText,
  Download
} from "lucide-react";

export const ExecutiveDashboard = () => {
  // Données consolidées pour le dashboard exécutif
  const keyMetrics = [
    { name: 'Étudiants Actifs', value: '2,847', change: '+5.2%', trend: 'up', color: 'blue' },
    { name: 'Taux de Réussite', value: '87.3%', change: '+2.1%', trend: 'up', color: 'green' },
    { name: 'Personnel Total', value: '142', change: '+1', trend: 'up', color: 'purple' },
    { name: 'Budget Exécuté', value: '68.5%', change: '+12.3%', trend: 'up', color: 'amber' }
  ];

  const departmentOverview = [
    { name: 'Sciences Économiques', students: 1247, staff: 32, courses: 45, budget: 4.2 },
    { name: 'Sciences de Gestion', students: 1035, staff: 28, courses: 38, budget: 3.8 },
    { name: 'Sciences Commerciales', students: 565, staff: 20, courses: 32, budget: 2.4 }
  ];

  const performanceEvolution = [
    { period: 'S1 2023', students: 2756, success_rate: 85.2, budget_execution: 45.2 },
    { period: 'S2 2023', students: 2823, success_rate: 87.1, budget_execution: 78.5 },
    { period: 'S1 2024', students: 2847, success_rate: 87.3, budget_execution: 68.5 }
  ];

  const budgetAllocation = [
    { category: 'Personnel', amount: 8.5, percentage: 65.4, color: '#3b82f6' },
    { category: 'Équipement', amount: 2.0, percentage: 15.4, color: '#10b981' },
    { category: 'Recherche', amount: 1.5, percentage: 11.5, color: '#f59e0b' },
    { category: 'Fonctionnement', amount: 1.0, percentage: 7.7, color: '#ef4444' }
  ];

  const handleExportReport = () => {
    console.log('Génération du rapport exécutif...');
    // Implémentation de l'export
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Tableau de Bord Exécutif</h2>
          <p className="text-slate-600">Vue d'ensemble des performances de la faculté FSECSG</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-800">
            Année 2024-2025
          </Badge>
          <Button onClick={handleExportReport} className="bg-indigo-600 hover:bg-indigo-700">
            <FileText className="h-4 w-4 mr-2" />
            Rapport Exécutif
          </Button>
        </div>
      </div>

      {/* Métriques Clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className={`border-${metric.color}-200 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-${metric.color}-600 text-sm font-medium`}>{metric.name}</p>
                  <p className={`text-3xl font-bold text-${metric.color}-800`}>{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-3 w-3 text-${metric.color}-600`} />
                    <span className={`text-xs text-${metric.color}-600`}>{metric.change}</span>
                  </div>
                </div>
                <div className={`p-3 bg-${metric.color}-200 rounded-full`}>
                  {metric.name.includes('Étudiants') && <Users className={`h-6 w-6 text-${metric.color}-600`} />}
                  {metric.name.includes('Réussite') && <Award className={`h-6 w-6 text-${metric.color}-600`} />}
                  {metric.name.includes('Personnel') && <GraduationCap className={`h-6 w-6 text-${metric.color}-600`} />}
                  {metric.name.includes('Budget') && <DollarSign className={`h-6 w-6 text-${metric.color}-600`} />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques Principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Performance par Département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" name="Étudiants" />
                <Bar dataKey="staff" fill="#10b981" name="Personnel" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Allocation Budgétaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={budgetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {budgetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}M DA`, 'Montant']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Évolution Temporelle */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Performances Clés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Étudiants" />
              <Area type="monotone" dataKey="success_rate" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Taux Réussite (%)" />
              <Area type="monotone" dataKey="budget_execution" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Exécution Budget (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Résumé des Actions Recommandées */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Recommandées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
              <h4 className="font-semibold text-amber-800 mb-2">Budget</h4>
              <p className="text-sm text-amber-700">Accélérer l'exécution budgétaire pour atteindre 85% avant fin d'année</p>
            </div>
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">Académique</h4>
              <p className="text-sm text-green-700">Maintenir le taux de réussite élevé avec des programmes de soutien</p>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-semibold text-blue-800 mb-2">Personnel</h4>
              <p className="text-sm text-blue-700">Planifier les recrutements pour les 5 postes vacants identifiés</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
