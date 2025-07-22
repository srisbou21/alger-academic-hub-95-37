
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SimpleTimetableGenerator } from './SimpleTimetableGenerator';
import { SimpleReservationManager } from '../reservation/SimpleReservationManager';
import { SystemStatsCard } from './SystemStatsCard';
import { AnalyticsTab } from './AnalyticsTab';
import { IntegrationFeaturesCard } from './IntegrationFeaturesCard';
import { 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  BarChart3
} from "lucide-react";

interface SystemStats {
  totalTimetables: number;
  activeReservations: number;
  conflictsResolved: number;
  utilizationRate: number;
}

export const IntegratedTimetableSystem = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalTimetables: 0,
    activeReservations: 0,
    conflictsResolved: 0,
    utilizationRate: 75
  });

  // Simuler des statistiques du système
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        totalTimetables: Math.floor(Math.random() * 50) + 100,
        activeReservations: Math.floor(Math.random() * 30) + 40,
        conflictsResolved: Math.floor(Math.random() * 10) + 5,
        utilizationRate: Math.floor(Math.random() * 20) + 70
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <SystemStatsCard stats={systemStats} />

      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Système opérationnel</strong> - L'intégration entre la génération d'emplois du temps et la gestion des réservations fonctionne correctement.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Générateur d'Emploi du Temps
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Gestion des Réservations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analyses et Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <SimpleTimetableGenerator />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <SimpleReservationManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>

      <IntegrationFeaturesCard />
    </div>
  );
};
