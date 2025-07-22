
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ScheduleGenerator } from "./planning/ScheduleGenerator";
import { ExamPlanning } from "./planning/ExamPlanning";
import { ResourceManagement } from "./ResourceManagement";
import { ConstraintManager } from "./planning/ConstraintManager";
import { OptimizationEngine } from "./planning/OptimizationEngine";
import { NotificationSystem } from "./planning/NotificationSystem";

export const PlanningModule = () => {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Module Planning IA</h2>
        <p className="text-slate-600">
          Génération automatique d'emplois du temps avec algorithmes d'optimisation avancés
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="generator"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Générateur IA
          </TabsTrigger>
          <TabsTrigger 
            value="constraints"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Contraintes
          </TabsTrigger>
          <TabsTrigger 
            value="optimization"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Optimisation
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="resources"
            className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
          >
            Ressources
          </TabsTrigger>
          <TabsTrigger 
            value="exams"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            Examens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <ScheduleGenerator />
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <ConstraintManager />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationEngine />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSystem />
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <ResourceManagement />
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <ExamPlanning />
        </TabsContent>
      </Tabs>
    </div>
  );
};
