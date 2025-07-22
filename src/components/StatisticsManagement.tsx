
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { StudentStatistics } from "./statistics/StudentStatistics";
import { PersonnelStatistics } from "./statistics/PersonnelStatistics";
import { AcademicStatistics } from "./statistics/AcademicStatistics";
import { FinancialStatistics } from "./statistics/FinancialStatistics";
import { ExecutiveDashboard } from "./statistics/ExecutiveDashboard";
import { ReportsCenter } from "./statistics/ReportsCenter";
import { DataImportExport } from "./statistics/DataImportExport";
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Database,
  CheckCircle2 
} from "lucide-react";

export const StatisticsManagement = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestion Statistique et Analyse des Données</h2>
          <p className="text-slate-600">Système centralisé d'analyse et de reporting pour la faculté</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Système opérationnel
          </Badge>
        </div>
      </div>

      {/* Indicateurs rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Étudiants Actifs</p>
                <p className="text-2xl font-bold text-blue-800">2,847</p>
                <p className="text-xs text-blue-500">+5.2% vs année dernière</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Taux de Réussite</p>
                <p className="text-2xl font-bold text-green-800">87.3%</p>
                <p className="text-xs text-green-500">+2.1% vs semestre dernier</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Personnel Enseignant</p>
                <p className="text-2xl font-bold text-purple-800">142</p>
                <p className="text-xs text-purple-500">3 nouveaux recrutements</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Budget Exécuté</p>
                <p className="text-2xl font-bold text-amber-800">68.5%</p>
                <p className="text-xs text-amber-500">En cours d'année</p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="students"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Étudiants
          </TabsTrigger>
          <TabsTrigger 
            value="personnel"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Personnel
          </TabsTrigger>
          <TabsTrigger 
            value="academic"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Académique
          </TabsTrigger>
          <TabsTrigger 
            value="financial"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Financier
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
          <TabsTrigger 
            value="data"
            className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
          >
            <Database className="h-4 w-4 mr-2" />
            Données
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ExecutiveDashboard />
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <StudentStatistics />
        </TabsContent>

        <TabsContent value="personnel" className="space-y-6">
          <PersonnelStatistics />
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <AcademicStatistics />
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <FinancialStatistics />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportsCenter />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataImportExport />
        </TabsContent>
      </Tabs>
    </div>
  );
};
