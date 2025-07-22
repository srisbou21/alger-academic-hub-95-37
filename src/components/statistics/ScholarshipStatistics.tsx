import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Award, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { scholarshipService } from "@/services/scholarshipService";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ScholarshipStatistics = () => {
  const [period, setPeriod] = useState("2024");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await scholarshipService.getScholarshipStatistics();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [period]);

  if (loading) {
    return <div className="p-8 text-center">Chargement des statistiques...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-600">Erreur lors du chargement des données</div>;
  }

  const applicationsByMonth = [
    { month: 'Jan', applications: 15, accepted: 4 },
    { month: 'Fév', applications: 22, accepted: 6 },
    { month: 'Mar', applications: 35, accepted: 9 },
    { month: 'Avr', applications: 28, accepted: 7 },
    { month: 'Mai', applications: 19, accepted: 5 },
    { month: 'Jun', applications: 12, accepted: 3 }
  ];

  const budgetAllocation = [
    { name: 'Formation', value: 45, amount: 180000 },
    { name: 'Recherche', value: 30, amount: 120000 },
    { name: 'Conférences', value: 15, amount: 60000 },
    { name: 'Stages', value: 10, amount: 40000 }
  ];

  const scholarshipTrends = [
    { year: '2020', total: 45, budget: 150000 },
    { year: '2021', total: 52, budget: 180000 },
    { year: '2022', total: 68, budget: 220000 },
    { year: '2023', total: 75, budget: 280000 },
    { year: '2024', total: 87, budget: 320000 }
  ];

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Statistiques des Bourses d'Études</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">Année 2024</SelectItem>
            <SelectItem value="2023">Année 2023</SelectItem>
            <SelectItem value="2022">Année 2022</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Bourses</p>
                <p className="text-3xl font-bold">{stats.totalScholarships}</p>
              </div>
              <Award className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Candidatures</p>
                <p className="text-3xl font-bold">{stats.totalApplications}</p>
              </div>
              <FileText className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Taux d'Acceptation</p>
                <p className="text-3xl font-bold">{stats.acceptanceRate}%</p>
              </div>
              <CheckCircle className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Score Moyen</p>
                <p className="text-3xl font-bold">{stats.averageScore}/20</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par type */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Type de Bourse</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.byType).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.byType).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution des candidatures par mois */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Candidatures</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#8884d8" name="Candidatures" />
                <Bar dataKey="accepted" fill="#82ca9d" name="Acceptées" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendances et budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendances historiques */}
        <Card>
          <CardHeader>
            <CardTitle>Tendances Historiques</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scholarshipTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="total" stroke="#8884d8" name="Nombre de bourses" />
                <Line yAxisId="right" type="monotone" dataKey="budget" stroke="#82ca9d" name="Budget (DZD)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Allocation budgétaire */}
        <Card>
          <CardHeader>
            <CardTitle>Allocation Budgétaire par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={budgetAllocation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`${value} K DZD`, name]} />
                <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableau de statuts */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Candidatures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {status === 'accepted' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                  {status === 'pending' && <Clock className="h-5 w-5 text-orange-500" />}
                  <span className="font-medium capitalize">{status === 'accepted' ? 'Acceptées' : status === 'rejected' ? 'Refusées' : 'En attente'}</span>
                </div>
                <Badge variant={status === 'accepted' ? 'default' : status === 'rejected' ? 'destructive' : 'secondary'}>
                  {String(count)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};