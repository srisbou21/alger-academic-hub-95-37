import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Calendar, Clock, AlertTriangle } from "lucide-react";

const attendanceData = [
  { month: 'Sept', attendance: 92, absences: 8 },
  { month: 'Oct', attendance: 88, absences: 12 },
  { month: 'Nov', attendance: 85, absences: 15 },
  { month: 'Déc', attendance: 78, absences: 22 },
  { month: 'Jan', attendance: 87, absences: 13 },
  { month: 'Fév', attendance: 90, absences: 10 },
];

const attendanceByFaculty = [
  { faculty: 'Médecine', rate: 94, absences: 6 },
  { faculty: 'Ingénierie', rate: 89, absences: 11 },
  { faculty: 'Sciences', rate: 86, absences: 14 },
  { faculty: 'Lettres', rate: 83, absences: 17 },
];

const examAttendance = [
  { exam: 'Partiels S1', attendance: 96, total: 5900 },
  { exam: 'Rattrapage S1', attendance: 78, total: 472 },
  { exam: 'Partiels S2', attendance: 94, total: 5900 },
  { exam: 'Rattrapage S2', attendance: 82, total: 354 },
];

export const AttendanceTracking = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedView, setSelectedView] = useState('global');

  return (
    <div className="space-y-6">
      <Card className="border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Suivi de l'Assiduité et Présence
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="semester">Semestre</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Vue globale</SelectItem>
                  <SelectItem value="faculty">Par faculté</SelectItem>
                  <SelectItem value="course">Par cours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques de présence */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Taux de Présence</p>
                <p className="text-3xl font-bold text-green-600">87%</p>
                <p className="text-xs text-green-500">+2% vs mois précédent</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Absences Totales</p>
                <p className="text-3xl font-bold text-red-600">13%</p>
                <p className="text-xs text-red-500">-2% vs mois précédent</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Absences Justifiées</p>
                <p className="text-3xl font-bold text-blue-600">8%</p>
                <p className="text-xs text-blue-500">Stable</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Retards</p>
                <p className="text-3xl font-bold text-purple-600">5%</p>
                <p className="text-xs text-purple-500">-0.5% vs mois précédent</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution de l'assiduité */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution Mensuelle de l'Assiduité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  name="Présence (%)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="absences" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  name="Absences (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assiduité par faculté */}
        <Card>
          <CardHeader>
            <CardTitle>Taux de Présence par Faculté</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceByFaculty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faculty" />
                <YAxis domain={[75, 100]} />
                <Tooltip />
                <Bar dataKey="rate" fill="#3B82F6" name="Taux de présence (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Participation aux examens */}
      <Card>
        <CardHeader>
          <CardTitle>Participation aux Examens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examAttendance.map((exam, index) => (
              <div key={exam.exam} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{exam.exam}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Participation</span>
                    <span className="font-medium">{exam.attendance}%</span>
                  </div>
                  <Progress value={exam.attendance} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {Math.round((exam.attendance / 100) * exam.total)} / {exam.total} étudiants
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
            <CardTitle className="text-lg">Étudiants Assidus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Présence {'>'} 95%</span>
                <Badge className="bg-green-100 text-green-800">1,247 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Présence 90-95%</span>
                <Badge className="bg-blue-100 text-blue-800">2,156 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Présence 85-90%</span>
                <Badge className="bg-yellow-100 text-yellow-800">1,789 étudiants</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Étudiants Absentéistes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Absences 25-50%</span>
                <Badge variant="destructive">456 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Absences {'>'} 50%</span>
                <Badge variant="destructive">189 étudiants</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Abandons potentiels</span>
                <Badge variant="destructive">67 étudiants</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Corrélation Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 bg-green-50 rounded text-sm">
                <strong>Présence {'>'} 90%:</strong> Moyenne 14.2/20
              </div>
              <div className="p-2 bg-yellow-50 rounded text-sm">
                <strong>Présence 75-90%:</strong> Moyenne 11.8/20
              </div>
              <div className="p-2 bg-red-50 rounded text-sm">
                <strong>Présence {'<'} 75%:</strong> Moyenne 8.4/20
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
