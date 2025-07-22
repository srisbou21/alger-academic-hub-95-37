import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimetableHeader } from './TimetableHeader';
import { QuickActions } from './QuickActions';
import { TimetableDashboard } from './TimetableDashboard';
import { FormationSelector } from './FormationSelector';
import { TimetableGenerator } from './TimetableGenerator';
import { TimetableValidation } from './TimetableValidation';
import { ReservationManager } from './ReservationManager';
import { ConstraintManagement } from './ConstraintManagement';
import { OptimizationDashboard } from './OptimizationDashboard';
import { NotificationSystem } from '../planning/NotificationSystem';
import { AutomationDashboard } from '../AutomationDashboard';
import { 
  Brain, 
  Zap, 
  Calendar, 
  Settings, 
  Bell, 
  BarChart3,
  CheckSquare,
  Building
} from "lucide-react";

export const NewTimetableModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleQuickAction = (action: string) => {
    setActiveTab(action);
  };

  return (
    <div className="space-y-6">
      <TimetableHeader />
      <QuickActions onAction={handleQuickAction} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger 
            value="formation"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Formation
          </TabsTrigger>
          <TabsTrigger 
            value="generator"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Générateur
          </TabsTrigger>
          <TabsTrigger 
            value="validation"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Validation
          </TabsTrigger>
          <TabsTrigger 
            value="constraints"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Contraintes
          </TabsTrigger>
          <TabsTrigger 
            value="optimization"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Optimisation
          </TabsTrigger>
          <TabsTrigger 
            value="reservation"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Building className="h-4 w-4 mr-2" />
            Réservation
          </TabsTrigger>
          <TabsTrigger 
            value="automation"
            className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Automatisation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <TimetableDashboard />
        </TabsContent>

        <TabsContent value="formation" className="space-y-6">
          <FormationSelector />
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <TimetableGenerator />
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <TimetableValidation />
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <ConstraintManagement />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationDashboard />
        </TabsContent>

        <TabsContent value="reservation" className="space-y-6">
          <ReservationManager />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <AutomationDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};