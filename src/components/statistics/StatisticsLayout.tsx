
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  DollarSign, 
  Building, 
  BarChart3,
  FileText,
  Settings,
  AlertTriangle,
  TrendingUp,
  Award
} from "lucide-react";
import { StudentStatistics } from "./StudentStatistics";
import { PersonnelStatistics } from "./PersonnelStatistics";
import { FinancialStatistics } from "./FinancialStatistics";
import { ExecutiveDashboard } from "./ExecutiveDashboard";
import { ReportsCenter } from "./ReportsCenter";
import { AcademicStatistics } from "./AcademicStatistics";
import { AdvancedStatistics } from "./AdvancedStatistics";
import { ScholarshipStatistics } from "./ScholarshipStatistics";

export const StatisticsLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Système de Gestion des Statistiques Universitaires
            </CardTitle>
            <p className="text-blue-100">
              Analyses complètes et indicateurs de performance de l'établissement
            </p>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white border border-blue-200">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tableau de Bord
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyse Avancée
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Étudiants
            </TabsTrigger>
            <TabsTrigger value="personnel" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Académique
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financier
            </TabsTrigger>
            <TabsTrigger value="scholarships" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Bourses
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Rapports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ExecutiveDashboard />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedStatistics />
          </TabsContent>

          <TabsContent value="students">
            <StudentStatistics />
          </TabsContent>

          <TabsContent value="personnel">
            <PersonnelStatistics />
          </TabsContent>

          <TabsContent value="academic">
            <AcademicStatistics />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialStatistics />
          </TabsContent>

          <TabsContent value="scholarships">
            <ScholarshipStatistics />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
