
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Line
} from 'recharts';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  UserPlus,
  UserMinus,
  Globe,
  Award
} from "lucide-react";
import { StudentStatsForm } from "./forms/StudentStatsForm";
import { useStatistics } from "../../hooks/useStatistics";

export const StudentStatistics = () => {
  const [showForm, setShowForm] = useState(false);
  const { saveStatistics } = useStatistics();

  const handleFormSave = async (data: any) => {
    try {
      await saveStatistics('students', data);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Données simulées pour les graphiques
  const studentsByDepartment = [
    { name: 'Sciences Économiques', total: 1247, male: 623, female: 624, foreign: 45 },
    { name: 'Sciences de Gestion', total: 1035, male: 518, female: 517, foreign: 38 },
    { name: 'Sciences Commerciales', total: 565, male: 282, female: 283, foreign: 22 }
  ];

  const studentsByLevel = [
    { name: 'L1', value: 892, percentage: 31.3, color: '#3b82f6' },
    { name: 'L2', value: 785, percentage: 27.6, color: '#10b981' },
    { name: 'L3', value: 623, percentage: 21.9, color: '#f59e0b' },
    { name: 'M1', value: 345, percentage: 12.1, color: '#8b5cf6' },
    { name: 'M2', value: 202, percentage: 7.1, color: '#ef4444' }
  ];

  const evolutionData = [
    { year: '2020-21', inscriptions: 2456, diplomés: 678, abandons: 89 },
    { year: '2021-22', inscriptions: 2621, diplomés: 724, abandons: 95 },
    { year: '2022-23', inscriptions: 2734, diplomés: 789, abandons: 87 },
    { year: '2023-24', inscriptions: 2847, diplomés: 856, abandons: 76 },
    { year: '2024-25', inscriptions: 2847, diplomés: 0, abandons: 42 }
  ];

  const successRateData = [
    { formation: 'Économie Générale', taux: 87.5, étudiants: 342 },
    { formation: 'Gestion Entreprises', taux: 82.3, étudiants: 298 },
    { formation: 'Marketing', taux: 89.1, étudiants: 187 },
    { formation: 'Finance', taux: 85.7, étudiants: 234 },
    { formation: 'Commerce International', taux: 91.2, étudiants: 156 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Statistiques Étudiantes</h2>
          <p className="text-slate-600">Analyse des effectifs et performance académique</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Masquer Formulaire' : 'Saisir Données'}
        </Button>
      </div>

      {showForm && (
        <StudentStatsForm onSave={handleFormSave} />
      )}

      {/* KPIs Étudiants */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">2,847</p>
            <p className="text-sm text-blue-600">Étudiants Actifs</p>
            <Badge className="mt-1 bg-blue-100 text-blue-700">+156 vs 2023</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <UserPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">645</p>
            <p className="text-sm text-green-600">Nouvelles Inscriptions</p>
            <Badge className="mt-1 bg-green-100 text-green-700">+12.3%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">105</p>
            <p className="text-sm text-purple-600">Étudiants Étrangers</p>
            <Badge className="mt-1 bg-purple-100 text-purple-700">3.7%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-800">87.1%</p>
            <p className="text-sm text-amber-600">Taux de Réussite</p>
            <Badge className="mt-1 bg-amber-100 text-amber-700">+2.4%</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="departments">Par Département</TabsTrigger>
          <TabsTrigger value="levels">Par Niveau</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
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
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" name="Total" />
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
                      label={({ name, percentage }) => `${name} ${percentage}%`}
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
              <CardTitle>Analyse Détaillée par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={studentsByDepartment} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="male" fill="#3b82f6" name="Masculin" />
                  <Bar dataKey="female" fill="#ec4899" name="Féminin" />
                  <Bar dataKey="foreign" fill="#f59e0b" name="Étrangers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Taux de Réussite par Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={successRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formation" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="taux" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Effectifs sur 5 ans</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inscriptions" stroke="#3b82f6" strokeWidth={3} name="Inscriptions" />
                  <Line type="monotone" dataKey="diplomés" stroke="#10b981" strokeWidth={3} name="Diplômés" />
                  <Line type="monotone" dataKey="abandons" stroke="#ef4444" strokeWidth={3} name="Abandons" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
