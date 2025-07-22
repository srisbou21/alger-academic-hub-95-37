
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CalendarDays, CheckSquare, Briefcase } from "lucide-react";
import { AdministrativeStatistics as AdminStatsType } from "../../types/administrative";
import { administrativeService } from "../../services/administrativeService";
import { useToast } from "@/hooks/use-toast";
import { AdministrativeAbsenceManager } from "./AdministrativeAbsenceManager";
import { AdministrativeTaskManager } from "./AdministrativeTaskManager";
import { HRStatistics } from "./overview/HRStatistics";
import { AdministrativeStatistics } from "./overview/AdministrativeStatistics";
import { StaffManagement } from "./administrative/StaffManagement";

export const AdministrativeManagement = () => {
  const [statistics, setStatistics] = useState<AdminStatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const statsData = await administrativeService.getStatistics();
      setStatistics(statsData);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      {/* <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Système de Gestion du Personnel Administratif
          </CardTitle>
          <p className="text-blue-100">
            Gestion complète du personnel administratif titulaire et vacataire de la faculté
          </p>
        </CardHeader>
      </Card> */}

      {/* <AdministrativeStatistics /> */}

      <Tabs defaultValue="personnel" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="personnel" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger 
            value="absences" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <CalendarDays className="h-4 w-4" />
            Absences
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <CheckSquare className="h-4 w-4" />
            Tâches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-6">
          <StaffManagement />
        </TabsContent>

        <TabsContent value="absences">
          <AdministrativeAbsenceManager />
        </TabsContent>

        <TabsContent value="tasks">
          <AdministrativeTaskManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
