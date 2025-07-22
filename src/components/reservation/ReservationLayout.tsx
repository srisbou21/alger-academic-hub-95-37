
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpaceCatalog } from "./SpaceCatalog";
import { ReservationCalendar } from "./ReservationCalendar";
import { ConflictManager } from "./ConflictManager";
import { ReservationDashboard } from "./ReservationDashboard";
import { AvailableTimeSlots } from "./AvailableTimeSlots";
import { ReservationProvider } from "../../contexts/ReservationContext";
import { useReservations } from "../../hooks/useReservations";
import { useSpaces } from "../../hooks/useSpaces";
import { Building2, Calendar, AlertTriangle, BarChart3, Clock } from "lucide-react";

const ReservationLayoutContent = () => {
  const [activeTab, setActiveTab] = useState("catalog");
  const reservations = useReservations();
  const spaces = useSpaces();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        <Card className="mb-6 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6" />
              Système Avancé de Gestion des Réservations
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-blue-200">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Catalogue des Espaces
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Créneaux Disponibles
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conflits
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tableau de Bord
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <SpaceCatalog />
          </TabsContent>

          <TabsContent value="availability">
            <AvailableTimeSlots />
          </TabsContent>

          <TabsContent value="calendar">
            <ReservationCalendar />
          </TabsContent>

          <TabsContent value="conflicts">
            <ConflictManager />
          </TabsContent>

          <TabsContent value="dashboard">
            <ReservationDashboard reservations={reservations} spaces={spaces} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export const ReservationLayout = () => {
  return (
    <ReservationProvider>
      <ReservationLayoutContent />
    </ReservationProvider>
  );
};
