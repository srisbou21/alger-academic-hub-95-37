
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpaceCatalog } from "./SpaceCatalog";
import { ReservationCalendar } from "./ReservationCalendar";
import { AdvancedConflictManager } from "./AdvancedConflictManager";
import { ReservationDashboard } from "./ReservationDashboard";
import { NotificationCenter } from "./NotificationCenter";
import { PredictiveAnalytics } from "./PredictiveAnalytics";
import { ChatbotAssistant } from "./ChatbotAssistant";
import { ResourceManagement } from "./ResourceManagement";
import { ExternalIntegrations } from "./ExternalIntegrations";
import { ReservationProvider } from "../../contexts/ReservationContext";
import { useReservations } from "../../hooks/useReservations";
import { useSpaces } from "../../hooks/useSpaces";
import { Building2, Calendar, AlertTriangle, BarChart3, Bell, Brain, Package, Link } from "lucide-react";

const tabConfig = [
  { value: "catalog", label: "Espaces", icon: Building2, description: "Catalogue des salles" },
  { value: "calendar", label: "Planning", icon: Calendar, description: "Réservations" },
  { value: "conflicts", label: "Conflits", icon: AlertTriangle, description: "Gestion des conflits" },
  { value: "notifications", label: "Notifications", icon: Bell, description: "Centre de notifications" },
  { value: "dashboard", label: "Tableau de Bord", icon: BarChart3, description: "Analytics" },
  { value: "ai", label: "IA & Analytics", icon: Brain, description: "Intelligence artificielle" },
  { value: "resources", label: "Ressources", icon: Package, description: "Gestion des ressources" },
  { value: "integrations", label: "Intégrations", icon: Link, description: "Intégrations externes" }
];

const AdvancedReservationContent = () => {
  const [activeTab, setActiveTab] = useState("catalog");
  const reservations = useReservations();
  const spaces = useSpaces();

  const currentTab = tabConfig.find(tab => tab.value === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        <Card className="mb-6 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6" />
              Système Avancé de Gestion des Réservations
            </CardTitle>
            {currentTab && (
              <p className="text-blue-100 text-sm mt-2">
                {currentTab.description}
              </p>
            )}
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-lg border border-blue-200 p-2">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-transparent gap-1">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="flex items-center gap-2 text-xs lg:text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="catalog">
            <SpaceCatalog />
          </TabsContent>

          <TabsContent value="calendar">
            <ReservationCalendar />
          </TabsContent>

          <TabsContent value="conflicts">
            <AdvancedConflictManager />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="dashboard">
            <ReservationDashboard reservations={reservations} spaces={spaces} />
          </TabsContent>

          <TabsContent value="ai">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PredictiveAnalytics />
              </div>
              <div>
                <ChatbotAssistant />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManagement />
          </TabsContent>

          <TabsContent value="integrations">
            <ExternalIntegrations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const AdvancedReservationLayout = () => {
  return (
    <ReservationProvider>
      <AdvancedReservationContent />
    </ReservationProvider>
  );
};
