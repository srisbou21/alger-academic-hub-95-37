
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, TrendingUp, UserPlus, BookOpen, GraduationCap } from "lucide-react";

const enrollmentData = [
  { year: '2019-20', total: 4500, new: 1200, returning: 3300 },
  { year: '2020-21', total: 4800, new: 1350, returning: 3450 },
  { year: '2021-22', total: 5200, new: 1500, returning: 3700 },
  { year: '2022-23', total: 5600, new: 1600, returning: 4000 },
  { year: '2023-24', total: 5900, new: 1650, returning: 4250 },
];

const byFaculty = [
  { name: 'Sciences', value: 35, count: 2065 },
  { name: 'Ingénierie', value: 30, count: 1770 },
  { name: 'Médecine', value: 20, count: 1180 },
  { name: 'Lettres', value: 15, count: 885 },
];

const byLevel = [
  { level: 'L1', count: 1800, percentage: 30.5 },
  { level: 'L2', count: 1600, percentage: 27.1 },
  { level: 'L3', count: 1400, percentage: 23.7 },
  { level: 'M1', count: 700, percentage: 11.9 },
  { level: 'M2', count: 400, percentage: 6.8 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const EnrollmentManagement = () => {
  const [selectedYear, setSelectedYear] = useState('2023-24');
  const [viewType, setViewType] = useState('overview');

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Gestion des Inscriptions et Effectifs
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2022-23">2022-23</SelectItem>
                  <SelectItem value="2021-22">2021-22</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Vue d'ensemble</SelectItem>
                  <SelectItem value="faculty">Par faculté</SelectItem>
                  <SelectItem value="level">Par niveau</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Effectif Total</p>
                <p className="text-3xl font-bold text-green-600">5,900</p>
                <p className="text-xs text-green-500">+5.4% vs année précédente</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Nouvelles Inscriptions</p>
                <p className="text-3xl font-bold text-blue-600">1,650</p>
                <p className="text-xs text-blue-500">+3.1% vs année précédente</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Réinscriptions</p>
                <p className="text-3xl font-bold text-purple-600">4,250</p>
                <p className="text-xs text-purple-500">+6.2% vs année précédente</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Taux de Rétention</p>
                <p className="text-3xl font-bold text-orange-600">89%</p>
                <p className="text-xs text-orange-500">+2.1% vs année précédente</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des effectifs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des Effectifs (5 ans)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} name="Total" />
                <Line type="monotone" dataKey="new" stroke="#10B981" strokeWidth={2} name="Nouveaux" />
                <Line type="monotone" dataKey="returning" stroke="#F59E0B" strokeWidth={2} name="Réinscriptions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par faculté */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Faculté</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byFaculty}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {byFaculty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {byFaculty.map((faculty, index) => (
                <div key={faculty.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{faculty.name}</span>
                  </div>
                  <span className="font-medium">{faculty.count} étudiants</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par niveau */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Niveau d'Études</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {byLevel.map((level, index) => (
              <div key={level.level} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-800 mb-2">{level.count}</div>
                <div className="text-sm text-slate-600 mb-2">{level.level}</div>
                <Progress value={level.percentage} className="h-2" />
                <div className="text-xs text-slate-500 mt-1">{level.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Détails par genre et origine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Femmes</span>
                <div className="flex items-center gap-2">
                  <Progress value={58} className="w-32 h-2" />
                  <span className="font-medium">58% (3,422)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Hommes</span>
                <div className="flex items-center gap-2">
                  <Progress value={42} className="w-32 h-2" />
                  <span className="font-medium">42% (2,478)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origine Géographique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Locale (même wilaya)</span>
                <Badge>45% (2,655)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Nationale (autres wilayas)</span>
                <Badge>50% (2,950)</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Internationale</span>
                <Badge>5% (295)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
