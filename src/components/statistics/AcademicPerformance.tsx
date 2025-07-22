
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, TrendingUp, Target, Award, BookOpen, Users } from "lucide-react";

const performanceData = [
  { semester: 'S1 2022', average: 12.4, passRate: 78 },
  { semester: 'S2 2022', average: 13.1, passRate: 82 },
  { semester: 'S1 2023', average: 12.9, passRate: 80 },
  { semester: 'S2 2023', average: 13.5, passRate: 85 },
  { semester: 'S1 2024', average: 13.2, passRate: 83 },
];

const gradeDistribution = [
  { grade: 'A (16-20)', count: 450, percentage: 12 },
  { grade: 'B (14-16)', count: 820, percentage: 22 },
  { grade: 'C (12-14)', count: 1180, percentage: 32 },
  { grade: 'D (10-12)', count: 890, percentage: 24 },
  { grade: 'F (<10)', count: 360, percentage: 10 },
];

const facultyPerformance = [
  { faculty: 'Médecine', average: 14.2, passRate: 92 },
  { faculty: 'Ingénierie', average: 13.8, passRate: 89 },
  { faculty: 'Sciences', average: 13.1, passRate: 85 },
  { faculty: 'Lettres', average: 12.9, passRate: 82 },
];

export const AcademicPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  return (
    <div className="space-y-6">
      <Card className="border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Performance Académique
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Actuel</SelectItem>
                  <SelectItem value="semester">Semestre</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes facultés</SelectItem>
                  <SelectItem value="sciences">Sciences</SelectItem>
                  <SelectItem value="engineering">Ingénierie</SelectItem>
                  <SelectItem value="medicine">Médecine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Performance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Moyenne Générale</p>
                <p className="text-3xl font-bold text-blue-600">13.2</p>
                <p className="text-xs text-blue-500">+0.3 vs semestre précédent</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Taux de Réussite</p>
                <p className="text-3xl font-bold text-green-600">83%</p>
                <p className="text-xs text-green-500">+2% vs semestre précédent</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Mentions TB/B</p>
                <p className="text-3xl font-bold text-purple-600">34%</p>
                <p className="text-xs text-purple-500">+1.5% vs semestre précédent</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Taux d'Abandon</p>
                <p className="text-3xl font-bold text-orange-600">8%</p>
                <p className="text-xs text-orange-500">-1% vs semestre précédent</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des performances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des Performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis yAxisId="left" domain={[10, 16]} />
                <YAxis yAxisId="right" orientation="right" domain={[70, 90]} />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="average" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  name="Moyenne (/20)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="passRate" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  name="Taux réussite (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution des notes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {gradeDistribution.map((grade, index) => (
                <div key={grade.grade} className="flex justify-between text-sm">
                  <span>{grade.grade}</span>
                  <span className="font-medium">{grade.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance par Faculté</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facultyPerformance.map((faculty, index) => (
              <div key={faculty.faculty} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{faculty.faculty}</h4>
                  <div className="flex gap-4">
                    <Badge variant="outline">Moyenne: {faculty.average}/20</Badge>
                    <Badge className="bg-green-100 text-green-800">
                      Réussite: {faculty.passRate}%
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Moyenne</span>
                    <Progress value={(faculty.average / 20) * 100} className="h-2 mt-1" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Taux de réussite</span>
                    <Progress value={faculty.passRate} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyses détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Étudiants d'Excellence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Major de promotion</span>
                <Badge>23 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mention Très Bien</span>
                <Badge>187 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bourses d'excellence</span>
                <Badge>45 étudiants</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Étudiants à Risque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Moyenne &lt; 8/20</span>
                <Badge variant="destructive">156 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Absences &gt; 25%</span>
                <Badge variant="destructive">89 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Risque d'abandon</span>
                <Badge variant="destructive">67 étudiants</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions Recommandées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded text-sm">
                <strong>Tutorat:</strong> 156 étudiants identifiés
              </div>
              <div className="p-2 bg-green-50 rounded text-sm">
                <strong>Suivi personnalisé:</strong> 89 étudiants
              </div>
              <div className="p-2 bg-orange-50 rounded text-sm">
                <strong>Réorientation:</strong> 34 étudiants
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
