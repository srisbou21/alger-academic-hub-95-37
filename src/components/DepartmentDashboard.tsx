import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, BookOpen, Calendar, CheckCircle, AlertTriangle, Building, GraduationCap, School } from "lucide-react";

export const DepartmentDashboard = () => {
  const successRateData = [
    { filiere: "Économie L1", taux: 78, effectif: 245, evolution: +5 },
    { filiere: "Économie L2", taux: 82, effectif: 198, evolution: +3 },
    { filiere: "Économie L3", taux: 85, effectif: 156, evolution: +2 },
    { filiere: "Gestion L1", taux: 75, effectif: 223, evolution: -2 },
    { filiere: "Gestion L2", taux: 79, effectif: 189, evolution: +1 },
    { filiere: "Gestion L3", taux: 83, effectif: 145, evolution: +4 }
  ];

  const teachingLoadData = [
    { enseignant: "Dr. Benali", charge: 320, max: 384, departement: "Économie" },
    { enseignant: "Pr. Khelil", charge: 384, max: 384, departement: "Gestion" },
    { enseignant: "Dr. Meziane", charge: 280, max: 384, departement: "Finance" },
    { enseignant: "Pr. Ouali", charge: 360, max: 384, departement: "Commerce" },
    { enseignant: "Dr. Benaissa", charge: 240, max: 384, departement: "Économie" }
  ];

  const scheduleData = [
    { semaine: "S1", conflits: 2, salles_libres: 15, taux_occupation: 85 },
    { semaine: "S2", conflits: 1, salles_libres: 12, taux_occupation: 88 },
    { semaine: "S3", conflits: 3, salles_libres: 18, taux_occupation: 82 },
    { semaine: "S4", conflits: 0, salles_libres: 20, taux_occupation: 80 }
  ];

  const departmentStats = [
    { name: "Économie", etudiants: 599, enseignants: 12, fill: "#3B82F6" },
    { name: "Gestion", etudiants: 557, enseignants: 10, fill: "#10B981" },
    { name: "Finance", etudiants: 234, enseignants: 6, fill: "#F59E0B" },
    { name: "Commerce", etudiants: 189, enseignants: 5, fill: "#EF4444" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <School className="h-8 w-8" />
            Tableau de Bord Départemental
          </CardTitle>
          <p className="text-blue-100">
            Vue d'ensemble des performances et indicateurs par département
          </p>
        </CardHeader>
      </Card>

      {/* Statistiques Générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Étudiants</p>
                <p className="text-3xl font-bold text-blue-800">1,579</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+5.2%</span>
                </div>
              </div>
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Enseignants</p>
                <p className="text-3xl font-bold text-green-800">33</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">Actifs</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Taux de Réussite</p>
                <p className="text-3xl font-bold text-amber-800">80.3%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+2.1%</span>
                </div>
              </div>
              <BookOpen className="h-12 w-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Conflits EDT</p>
                <p className="text-3xl font-bold text-purple-800">6</p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 text-amber-600 mr-1" />
                  <span className="text-xs text-amber-600">À résoudre</span>
                </div>
              </div>
              <Calendar className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="success-rates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="success-rates">Taux de Réussite</TabsTrigger>
          <TabsTrigger value="teaching-load">Charges Enseignement</TabsTrigger>
          <TabsTrigger value="schedules">Emplois du Temps</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
        </TabsList>

        <TabsContent value="success-rates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyse des Taux de Réussite par Filière
              </CardTitle>
              <CardDescription>
                Évolution et performance académique par programme d'études
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {successRateData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">{item.filiere}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={item.evolution > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {item.evolution > 0 ? "+" : ""}{item.evolution}%
                          </Badge>
                          <span className="font-bold text-lg">{item.taux}%</span>
                        </div>
                      </div>
                      <Progress value={item.taux} className="h-2 mb-1" />
                      <p className="text-sm text-slate-600">{item.effectif} étudiants</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teaching-load" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Répartition des Charges d'Enseignement
              </CardTitle>
              <CardDescription>
                Suivi de la charge de travail des enseignants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teachingLoadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="enseignant" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="charge" fill="#3B82F6" name="Charge actuelle" />
                  <Bar dataKey="max" fill="#E5E7EB" name="Charge maximale" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Analyse des Emplois du Temps
              </CardTitle>
              <CardDescription>
                Optimisation et gestion des conflits d'horaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scheduleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semaine" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conflits" stroke="#EF4444" name="Conflits" />
                  <Line type="monotone" dataKey="taux_occupation" stroke="#3B82F6" name="Taux d'occupation %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Répartition par Département
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="etudiants"
                    >
                      {departmentStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détails par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: dept.fill }}
                        ></div>
                        <div>
                          <h4 className="font-medium text-slate-800">{dept.name}</h4>
                          <p className="text-sm text-slate-600">{dept.enseignants} enseignants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">{dept.etudiants}</p>
                        <p className="text-sm text-slate-600">étudiants</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
