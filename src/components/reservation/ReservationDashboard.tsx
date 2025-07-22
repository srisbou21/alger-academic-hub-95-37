
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useReservations } from "../../hooks/useReservations";
import { useSpaces } from "../../hooks/useSpaces";
import { ReservationStats } from "./ReservationStats";
import { BarChart3, Calendar, Building2, Users, Download, RefreshCw } from "lucide-react";

interface ReservationDashboardProps {
  reservations: ReturnType<typeof useReservations>;
  spaces: ReturnType<typeof useSpaces>;
}

export const ReservationDashboard: React.FC<ReservationDashboardProps> = ({ 
  reservations, 
  spaces 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await spaces.loadSpaces();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Logique d'export des données
    const data = {
      reservations: reservations.reservations,
      spaces: spaces.allSpaces,
      stats: reservations.stats,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Tableau de bord</h2>
          <p className="text-muted-foreground">Vue d'ensemble des réservations et statistiques</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Onglets du tableau de bord */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="spaces" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Espaces
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilisation
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ReservationStats reservations={reservations} spaces={spaces} />
        </TabsContent>

        <TabsContent value="spaces">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance des espaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {spaces.allSpaces.map(space => {
                    const spaceReservations = reservations.reservations.filter(r => r.spaceId === space.id);
                    const utilizationRate = (spaceReservations.length / Math.max(reservations.reservations.length, 1)) * 100;
                    
                    return (
                      <div key={space.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{space.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {space.location.building} - Capacité: {space.capacity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{spaceReservations.length} réservations</p>
                          <p className="text-sm text-muted-foreground">
                            {utilizationRate.toFixed(1)}% d'utilisation
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Heures de pointe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">9h-11h</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">14h-16h</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">16h-18h</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Jours populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Mardi</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mercredi</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Jeudi</span>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Durée moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cours</span>
                      <span className="text-sm font-medium">2h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Réunion</span>
                      <span className="text-sm font-medium">1h30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Examen</span>
                      <span className="text-sm font-medium">3h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des tendances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Tendances positives</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Augmentation de 15% des réservations ce mois</li>
                      <li>• Taux d'annulation en baisse (-5%)</li>
                      <li>• Meilleure utilisation des espaces (+8%)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Recommandations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Optimiser les créneaux 12h-14h (sous-utilisés)</li>
                      <li>• Promouvoir les espaces de petite capacité</li>
                      <li>• Étendre les horaires d'ouverture le soir</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
