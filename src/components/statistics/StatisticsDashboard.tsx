
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Line
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Building,
  GraduationCap
} from "lucide-react";
import { StatisticsFilterPanel } from "./StatisticsFilterPanel";
import { useStatistics } from "../../hooks/useStatistics";

export const StatisticsDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedFormation, setSelectedFormation] = useState("all");
  
  const { statistics, isLoading } = useStatistics();

  // Données simulées pour la démonstration
  const studentsByDepartment = [
    { name: 'Économie', students: 1247, formations: 8 },
    { name: 'Gestion', students: 1035, formations: 6 },
    { name: 'Commerce', students: 565, formations: 4 }
  ];

  const studentsByLevel = [
    { name: 'L1', value: 892, color: '#3b82f6' },
    { name: 'L2', value: 785, color: '#10b981' },
    { name: 'L3', value: 623, color: '#f59e0b' },
    { name: 'M1', value: 345, color: '#8b5cf6' },
    { name: 'M2', value: 202, color: '#ef4444' }
  ];

  const evolutionData = [
    { year: '2020-21', students: 2456, graduations: 678 },
    { year: '2021-22', students: 2621, graduations: 724 },
    { year: '2022-23', students: 2734, graduations: 789 },
    { year: '2023-24', students: 2847, graduations: 856 },
    { year: '2024-25', students: 2847, graduations: 0 }
  ];

  const successRateByFormation = [
    { formation: 'Économie Générale', rate: 87.5, students: 342 },
    { formation: 'Gestion Entreprises', rate: 82.3, students: 298 },
    { formation: 'Marketing', rate: 89.1, students: 187 },
    { formation: 'Finance', rate: 85.7, students: 234 },
    { formation: 'Commerce Intl', rate: 91.2, students: 156 }
  ];

  const handleApplyFilters = () => {
    console.log('Applying filters:', {
      selectedYear,
      selectedDepartment,
      selectedLevel,
      selectedFormation
    });
    // Ici on filtrerait réellement les données
  };

  const handleExportData = () => {
    console.log('Exporting filtered data...');
    // Implémenter l'export des données filtrées
  };

  return (
    <div className="space-y-6">
      {/* KPIs Généraux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">2,847</p>
            <p className="text-sm text-blue-600">Étudiants Actifs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">18</p>
            <p className="text-sm text-green-600">Formations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">3</p>
            <p className="text-sm text-purple-600">Départements</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-800">87.3%</p>
            <p className="text-sm text-orange-600">Taux Réussite</p>
          </CardContent>
        </Card>
      </div>

      <StatisticsFilterPanel
        selectedYear={selectedYear}
        selectedDepartment={selectedDepartment}
        selectedLevel={selectedLevel}
        selectedFormation={selectedFormation}
        onYearChange={setSelectedYear}
        onDepartmentChange={setSelectedDepartment}
        onLevelChange={setSelectedLevel}
        onFormationChange={setSelectedFormation}
        onApplyFilters={handleApplyFilters}
        onExportData={handleExportData}
        totalRecords={2847}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tableau de Bord</TabsTrigger>
          <TabsTrigger value="departments">Étudiants</TabsTrigger>
          <TabsTrigger value="formations">Personnel</TabsTrigger>
          <TabsTrigger value="evolution">Académique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentsByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={studentsByLevel}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {studentsByLevel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques Détaillées par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={studentsByDepartment} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#10b981" name="Étudiants" />
                  <Bar dataKey="formations" fill="#f59e0b" name="Formations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Taux de Réussite par Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={successRateByFormation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formation" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Effectifs et Diplômés</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" name="Étudiants" strokeWidth={2} />
                  <Line type="monotone" dataKey="graduations" stroke="#10b981" name="Diplômés" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
