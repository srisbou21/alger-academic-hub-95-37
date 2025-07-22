
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
  BookOpen, 
  Clock, 
  Award, 
  FileText,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";
import { AcademicStatsForm } from "./forms/AcademicStatsForm";
import { useStatistics } from "../../hooks/useStatistics";

export const AcademicStatistics = () => {
  const [showForm, setShowForm] = useState(false);
  const { saveStatistics } = useStatistics();

  const handleFormSave = async (data: any) => {
    try {
      await saveStatistics('academic', data);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Données simulées pour les graphiques
  const coursesByDepartment = [
    { name: 'Sciences Économiques', total: 45, theorique: 28, pratique: 17, heures: 675 },
    { name: 'Sciences de Gestion', total: 38, theorique: 24, pratique: 14, heures: 570 },
    { name: 'Sciences Commerciales', total: 32, theorique: 20, pratique: 12, heures: 480 }
  ];

  const gradeDistribution = [
    { grade: '16-20', count: 245, percentage: 12.3, color: '#10b981' },
    { grade: '14-16', count: 456, percentage: 22.8, color: '#3b82f6' },
    { grade: '12-14', count: 678, percentage: 33.9, color: '#f59e0b' },
    { grade: '10-12', count: 456, percentage: 22.8, color: '#ef4444' },
    { grade: '0-10', count: 165, percentage: 8.2, color: '#6b7280' }
  ];

  const semesterProgression = [
    { semestre: 'S1 2023-24', moyenne: 12.5, taux_reussite: 78.5, participants: 2847 },
    { semestre: 'S2 2023-24', moyenne: 13.1, taux_reussite: 82.3, participants: 2789 },
    { semestre: 'S1 2024-25', moyenne: 12.8, taux_reussite: 80.1, participants: 2947 }
  ];

  const evaluationMethods = [
    { type: 'Examens Finaux', count: 89, percentage: 62.7 },
    { type: 'Contrôle Continu', count: 45, percentage: 31.7 },
    { type: 'Projets', count: 8, percentage: 5.6 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Statistiques Académiques</h2>
          <p className="text-slate-600">Performance pédagogique et résultats d'apprentissage</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          {showForm ? 'Masquer Formulaire' : 'Saisir Données'}
        </Button>
      </div>

      {showForm && (
        <AcademicStatsForm onSave={handleFormSave} />
      )}

      {/* KPIs Académiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-800">115</p>
            <p className="text-sm text-green-600">Cours Dispensés</p>
            <Badge className="mt-1 bg-green-100 text-green-700">3 départements</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">1,725</p>
            <p className="text-sm text-blue-600">Heures d'Enseignement</p>
            <Badge className="mt-1 bg-blue-100 text-blue-700">Par semestre</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-800">80.3%</p>
            <p className="text-sm text-amber-600">Taux de Réussite</p>
            <Badge className="mt-1 bg-amber-100 text-amber-700">+2.8% vs S1</Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-800">12.8</p>
            <p className="text-sm text-purple-600">Moyenne Générale</p>
            <Badge className="mt-1 bg-purple-100 text-purple-700">/20</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="courses">Cours & Heures</TabsTrigger>
          <TabsTrigger value="grades">Notes & Résultats</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cours par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={coursesByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#10b981" name="Total Cours" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Méthodes d'Évaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={evaluationMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {evaluationMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition Théorique vs Pratique</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={coursesByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="theorique" fill="#3b82f6" name="Cours Théoriques" />
                  <Bar dataKey="pratique" fill="#10b981" name="Cours Pratiques" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={semesterProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semestre" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="moyenne" stroke="#3b82f6" strokeWidth={3} name="Moyenne Générale" />
                  <Line type="monotone" dataKey="taux_reussite" stroke="#10b981" strokeWidth={3} name="Taux de Réussite (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
