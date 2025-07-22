
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter, Download, BarChart3, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { User as UserType } from "../../types/user";
import { TeacherAbsence } from "../../types/teacher";
import { absenceService } from "../../services/absenceService";
import { useToast } from "@/hooks/use-toast";

interface AdvancedAbsenceTrackingProps {
  currentUser: UserType;
}

interface AbsenceStats {
  totalAbsences: number;
  totalDays: number;
  justifiedRate: number;
  byType: { [key: string]: number };
  byMonth: { month: string; count: number; days: number }[];
  byTeacher: { teacherId: string; name: string; count: number; days: number }[];
  byDepartment: { department: string; count: number; rate: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AdvancedAbsenceTracking: React.FC<AdvancedAbsenceTrackingProps> = ({ currentUser }) => {
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [stats, setStats] = useState<AbsenceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024-2025');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedView, setSelectedView] = useState<'overview' | 'teacher' | 'department' | 'timeline'>('overview');
  const { toast } = useToast();

  // Mock teachers data
  const teachers = [
    { id: 'teacher_1', name: 'Dr. Ahmed Benali', department: 'Informatique' },
    { id: 'teacher_2', name: 'Dr. Fatima Zohra', department: 'Informatique' },
    { id: 'teacher_3', name: 'Dr. Karim Messaoudi', department: 'Informatique' },
    { id: 'teacher_4', name: 'Dr. Amina Khelifi', department: 'Mathématiques' },
    { id: 'teacher_5', name: 'Dr. Omar Benaissa', department: 'Physique' }
  ];

  const departments = ['Informatique', 'Mathématiques', 'Physique', 'Chimie'];

  useEffect(() => {
    loadAbsenceData();
  }, [selectedTeacher, selectedDepartment, selectedSemester, selectedAcademicYear, dateFrom, dateTo]);

  const loadAbsenceData = async () => {
    setLoading(true);
    try {
      const filters = {
        teacherId: selectedTeacher !== 'all' ? selectedTeacher : undefined,
        department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
        academicYear: selectedAcademicYear,
        startDate: dateFrom ? new Date(dateFrom) : undefined,
        endDate: dateTo ? new Date(dateTo) : undefined
      };

      const data = await absenceService.getAbsences(currentUser, filters);
      setAbsences(data);
      calculateStats(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'absence",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (absenceData: TeacherAbsence[]) => {
    const totalAbsences = absenceData.length;
    const totalDays = absenceData.reduce((sum, abs) => {
      const days = Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);
    
    const justified = absenceData.filter(abs => abs.isJustified).length;
    const justifiedRate = totalAbsences > 0 ? (justified / totalAbsences) * 100 : 0;

    // Group by type
    const byType = absenceData.reduce((acc, abs) => {
      acc[abs.type] = (acc[abs.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Group by month
    const byMonth = absenceData.reduce((acc, abs) => {
      const month = abs.startDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.count += 1;
        existing.days += Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      } else {
        acc.push({
          month,
          count: 1,
          days: Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        });
      }
      return acc;
    }, [] as { month: string; count: number; days: number }[]);

    // Group by teacher
    const byTeacher = absenceData.reduce((acc, abs) => {
      const teacher = teachers.find(t => t.id === abs.teacherId);
      const teacherName = teacher ? teacher.name : `Enseignant ${abs.teacherId}`;
      const existing = acc.find(item => item.teacherId === abs.teacherId);
      if (existing) {
        existing.count += 1;
        existing.days += Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      } else {
        acc.push({
          teacherId: abs.teacherId,
          name: teacherName,
          count: 1,
          days: Math.ceil((abs.endDate.getTime() - abs.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        });
      }
      return acc;
    }, [] as { teacherId: string; name: string; count: number; days: number }[]);

    // Group by department
    const byDepartment = departments.map(dept => {
      const deptTeachers = teachers.filter(t => t.department === dept);
      const deptAbsences = absenceData.filter(abs => 
        deptTeachers.some(t => t.id === abs.teacherId)
      );
      return {
        department: dept,
        count: deptAbsences.length,
        rate: deptTeachers.length > 0 ? (deptAbsences.length / deptTeachers.length) : 0
      };
    });

    setStats({
      totalAbsences,
      totalDays,
      justifiedRate,
      byType,
      byMonth: byMonth.sort((a, b) => a.month.localeCompare(b.month)),
      byTeacher: byTeacher.sort((a, b) => b.count - a.count),
      byDepartment
    });
  };

  const exportData = () => {
    toast({
      title: "Export en cours",
      description: "Les données d'absence sont en cours d'export..."
    });
  };

  const pieData = stats ? Object.entries(stats.byType).map(([type, count]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    value: count
  })) : [];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-500">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <BarChart3 className="h-6 w-6" />
            Suivi Avancé des Absences - {currentUser.role === 'super_admin' ? 'Super Admin' : 
              currentUser.role === 'admin_faculty' ? 'Doyen' : 
              currentUser.role === 'dept_head' ? 'Chef de Département' : 'Responsable'}
          </CardTitle>
          <p className="text-purple-600">
            Analyse détaillée et visualisations des absences enseignantes
          </p>
        </CardHeader>
      </Card>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Enseignant</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les enseignants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les enseignants</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les semestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les semestres</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Année Académique</Label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Début</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Fin</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={loadAbsenceData} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button onClick={exportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques globales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Absences</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.totalAbsences}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Jours Perdus</p>
                  <p className="text-2xl font-bold text-orange-800">{stats.totalDays}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Taux Justifié</p>
                  <p className="text-2xl font-bold text-green-800">{stats.justifiedRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Enseignants Concernés</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.byTeacher.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Onglets de visualisation */}
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setSelectedView('overview')}
          className={`px-4 py-2 border-b-2 ${selectedView === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setSelectedView('teacher')}
          className={`px-4 py-2 border-b-2 ${selectedView === 'teacher' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
        >
          Par Enseignant
        </button>
        <button
          onClick={() => setSelectedView('department')}
          className={`px-4 py-2 border-b-2 ${selectedView === 'department' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
        >
          Par Département
        </button>
        <button
          onClick={() => setSelectedView('timeline')}
          className={`px-4 py-2 border-b-2 ${selectedView === 'timeline' ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}
        >
          Évolution Temporelle
        </button>
      </div>

      {/* Graphiques selon la vue sélectionnée */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedView === 'overview' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Type d'Absence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Absences par Département</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.byDepartment}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {selectedView === 'teacher' && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Absences par Enseignant</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.byTeacher.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" name="Nombre d'absences" />
                    <Bar dataKey="days" fill="#8884d8" name="Jours d'absence" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {selectedView === 'timeline' && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution des Absences par Mois</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stats.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Nombre d'absences" />
                    <Line type="monotone" dataKey="days" stroke="#82ca9d" name="Jours d'absence" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Liste détaillée des absences */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Absences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {absences.map((absence) => {
              const teacher = teachers.find(t => t.id === absence.teacherId);
              return (
                <div key={absence.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{teacher?.name || `Enseignant ${absence.teacherId}`}</h4>
                    <div className="flex gap-2">
                      <Badge className={
                        absence.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        absence.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {absence.status === 'pending' ? 'En attente' :
                         absence.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                      </Badge>
                      {absence.isJustified && (
                        <Badge className="bg-blue-100 text-blue-800">Justifiée</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Période:</strong> {absence.startDate.toLocaleDateString('fr-FR')} - {absence.endDate.toLocaleDateString('fr-FR')}</p>
                      <p><strong>Type:</strong> {absence.type.replace('_', ' ')}</p>
                      <p><strong>Département:</strong> {teacher?.department || 'N/A'}</p>
                    </div>
                    <div>
                      <p><strong>Motif:</strong> {absence.reason}</p>
                      <p><strong>Cours affectés:</strong> {absence.coursesAffected.join(', ')}</p>
                      {absence.replacementTeacherId && (
                        <p><strong>Remplaçant:</strong> {teachers.find(t => t.id === absence.replacementTeacherId)?.name || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
