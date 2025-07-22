
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, Building2, Users, GraduationCap, Euro, FileText, Award, Target, AlertCircle, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const FacultyDirection = () => {
  const budgetData = [
    { month: "Sept", budget: 450000, depenses: 380000, ecart: 70000 },
    { month: "Oct", budget: 420000, depenses: 395000, ecart: 25000 },
    { month: "Nov", budget: 410000, depenses: 405000, ecart: 5000 },
    { month: "Déc", budget: 380000, depenses: 375000, ecart: 5000 },
    { month: "Jan", budget: 460000, depenses: 440000, ecart: 20000 },
    { month: "Fév", budget: 440000, depenses: 435000, ecart: 5000 }
  ];

  const performanceData = [
    { indicator: "Taux de réussite global", value: 83.5, target: 85, status: "warning" },
    { indicator: "Taux d'insertion professionnelle", value: 89.2, target: 85, status: "success" },
    { indicator: "Satisfaction étudiants", value: 91.7, target: 90, status: "success" },
    { indicator: "Publications scientifiques", value: 76.3, target: 80, status: "warning" },
    { indicator: "Projets de recherche", value: 94.1, target: 90, status: "success" }
  ];

  const departmentBudgets = [
    { name: "Économie", budget: 180000, used: 165000, percentage: 92 },
    { name: "Gestion", budget: 150000, used: 142000, percentage: 95 },
    { name: "Commerce", budget: 120000, used: 108000, percentage: 90 },
    { name: "Finance", budget: 100000, used: 88000, percentage: 88 }
  ];

  const evolutionData = [
    { year: "2020", etudiants: 4200, diplomés: 980, budget: 1800000 },
    { year: "2021", etudiants: 4350, diplomés: 1050, budget: 1920000 },
    { year: "2022", etudiants: 4620, diplomés: 1180, budget: 2050000 },
    { year: "2023", etudiants: 4780, diplomés: 1245, budget: 2180000 },
    { year: "2024", etudiants: 4847, diplomés: 1290, budget: 2250000 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-emerald-600";
      case "warning": return "text-amber-600";
      case "danger": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "danger": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="strategic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategic">Pilotage Stratégique</TabsTrigger>
          <TabsTrigger value="budget">Suivi Budgétaire</TabsTrigger>
          <TabsTrigger value="reporting">Reporting Institutionnel</TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-6">
          {/* KPI Stratégiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Effectifs totaux</p>
                    <p className="text-2xl font-bold text-blue-800">4,847</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">+3.8% vs 2023</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-medium">Taux réussite global</p>
                    <p className="text-2xl font-bold text-emerald-800">83.5%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">+2.1% vs 2023</span>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Budget annuel</p>
                    <p className="text-2xl font-bold text-purple-800">2.25M€</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">+3.2% vs 2023</span>
                    </div>
                  </div>
                  <Euro className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">Diplômés 2024</p>
                    <p className="text-2xl font-bold text-amber-800">1,290</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      <span className="text-xs text-emerald-600">+3.6% vs 2023</span>
                    </div>
                  </div>
                  <GraduationCap className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution Institutionnelle */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Évolution Institutionnelle
                </CardTitle>
                <CardDescription>Croissance sur 5 ans</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="etudiants" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="diplomés" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Indicateurs de Performance */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-slate-600" />
                  Indicateurs de Performance
                </CardTitle>
                <CardDescription>Objectifs vs réalisations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-slate-700">{item.indicator}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${getStatusColor(item.status)}`}>
                          {item.value}%
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          (obj: {item.target}%)
                        </span>
                      </div>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution Budgétaire */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-slate-600" />
                  Suivi Budgétaire Mensuel
                </CardTitle>
                <CardDescription>Budget vs dépenses réelles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()}€`, ""]} />
                    <Bar dataKey="budget" fill="#3B82F6" name="Budget alloué" />
                    <Bar dataKey="depenses" fill="#EF4444" name="Dépenses réelles" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par Département */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  Budget par Département
                </CardTitle>
                <CardDescription>Utilisation des budgets alloués</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentBudgets.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{dept.name}</span>
                      <div className="text-right">
                        <span className="font-semibold text-slate-800">
                          {dept.used.toLocaleString()}€
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          / {dept.budget.toLocaleString()}€
                        </span>
                      </div>
                    </div>
                    <Progress value={dept.percentage} className="h-2" />
                    <p className="text-xs text-slate-500">{dept.percentage}% utilisé</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Actions Budgétaires */}
          <Card className="border-amber-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                Actions Budgétaires Requises
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Dépassements</h4>
                  <p className="text-sm text-red-600">2 départements en dépassement budgétaire</p>
                  <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
                    Analyser
                  </Button>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">Réallocations</h4>
                  <p className="text-sm text-amber-600">15% du budget non utilisé à réaffecter</p>
                  <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                    Planifier
                  </Button>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Prévisions</h4>
                  <p className="text-sm text-blue-600">Mise à jour des prévisions Q2</p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Réviser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          {/* Rapports Institutionnels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Rapports Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Rapport Annuel 2024</h4>
                    <p className="text-sm text-slate-500">Synthèse complète des activités</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">Finalisé</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Bilan Pédagogique S1</h4>
                    <p className="text-sm text-slate-500">Résultats du premier semestre</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800">En cours</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Rapport Budgétaire</h4>
                    <p className="text-sm text-slate-500">Exécution budgétaire 2024</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  Communication Université
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                  <h4 className="font-semibold text-blue-800">Conseil d'Administration</h4>
                  <p className="text-sm text-blue-600 mt-1">Présentation prévue le 28 juin 2024</p>
                  <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                    Préparer présentation
                  </Button>
                </div>
                <div className="p-4 border-l-4 border-emerald-500 bg-emerald-50">
                  <h4 className="font-semibold text-emerald-800">Comité de Pilotage</h4>
                  <p className="text-sm text-emerald-600 mt-1">Rapport mensuel transmis</p>
                  <Button size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700">
                    Consulter retours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Institutionnelles */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-slate-600" />
                Actions Stratégiques Prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Générer rapport annuel</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Tableau de bord exec</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm">Communication univ</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
