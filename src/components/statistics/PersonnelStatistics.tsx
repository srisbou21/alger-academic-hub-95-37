
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
  UserCheck, 
  Users, 
  GraduationCap, 
  Briefcase,
  UserPlus,
  UserMinus,
  TrendingUp
} from "lucide-react";
import { PersonnelStatsForm } from "./forms/PersonnelStatsForm";
import { useStatistics } from "../../hooks/useStatistics";

export const PersonnelStatistics = () => {
  const [showForm, setShowForm] = useState(false);
  const { saveStatistics } = useStatistics();

  const handleFormSave = async (data: any) => {
    try {
      await saveStatistics('personnel', data);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Données simulées pour les graphiques
  const personnelByGrade = [
    { grade: 'Professeurs', count: 12, percentage: 8.5 },
    { grade: 'Maîtres de Conférences', count: 28, percentage: 19.7 },
    { grade: 'Maîtres Assistants', count: 35, percentage: 24.6 },
    { grade: 'Chargés de Cours', count: 25, percentage: 17.6 },
    { grade: 'Personnel Admin', count: 28, percentage: 19.7 },
    { grade: 'Personnel Technique', count: 14, percentage: 9.9 }
  ];

  const personnelByDepartment = [
    { name: 'Sciences Économiques', enseignants: 32, admin: 8, technique: 4 },
    { name: 'Sciences de Gestion', enseignants: 28, admin: 12, technique: 5 },
    { name: 'Sciences Commerciales', enseignants: 20, admin: 8, technique: 3 },
    { name: 'Administration Générale', enseignants: 0, admin: 15, technique: 7 }
  ];

  const evolutionPersonnel = [
    { year: '2020', total: 132, recrutements: 8, départs: 5 },
    { year: '2021', total: 135, recrutements: 6, départs: 3 },
    { year: '2022', total: 138, recrutements: 7, départs: 4 },
    { year: '2023', total: 141, recrutements: 5, départs: 2 },
    { year: '2024', total: 142, recrutements: 3, départs: 2 }
  ];

  const repartitionGenre = [
    { name: 'Hommes', value: 85, percentage: 59.9, color: '#3b82f6' },
    { name: 'Femmes', value: 57, percentage: 40.1, color: '#ec4899' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Statistiques du Personnel</h2>
          <p className="text-slate-600">Gestion des ressources humaines et évolution des effectifs</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {showForm ? 'Masquer Formulaire' : 'Saisir Données'}
        </Button>
      </div>

      {showForm && (
        <PersonnelStatsForm onSave={handleFormSave} />
      )}

      {/* KPIs Personnel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">142</p>
            <p className="text-sm text-purple-600">Personnel Total</p>
            <Badge className="mt-1 bg-purple-100 text-purple-700">+1 vs 2023</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">100</p>
            <p className="text-sm text-blue-600">Enseignants</p>
            <Badge className="mt-1 bg-blue-100 text-blue-700">70.4%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <UserPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">3</p>
            <p className="text-sm text-green-600">Nouveaux Recrutés</p>
            <Badge className="mt-1 bg-green-100 text-green-700">2024</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4 text-center">
            <Briefcase className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-800">5</p>
            <p className="text-sm text-amber-600">Postes Vacants</p>
            <Badge className="mt-1 bg-amber-100 text-amber-700">À pourvoir</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="grades">Par Grade</TabsTrigger>
          <TabsTrigger value="departments">Par Département</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={personnelByGrade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Genre</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={repartitionGenre}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {repartitionGenre.map((entry, index) => (
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

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personnelByGrade.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                      <span className="font-medium">{grade.grade}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{grade.count} personnes</p>
                      <p className="text-sm text-slate-600">{grade.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personnel par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={personnelByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enseignants" fill="#3b82f6" name="Enseignants" />
                  <Bar dataKey="admin" fill="#10b981" name="Administratif" />
                  <Bar dataKey="technique" fill="#f59e0b" name="Technique" />
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
                <LineChart data={evolutionPersonnel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} name="Total Personnel" />
                  <Line type="monotone" dataKey="recrutements" stroke="#10b981" strokeWidth={2} name="Recrutements" />
                  <Line type="monotone" dataKey="départs" stroke="#ef4444" strokeWidth={2} name="Départs" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
