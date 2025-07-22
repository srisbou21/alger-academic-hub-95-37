
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Link, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Building2,
  Users,
  Zap
} from "lucide-react";

export const TimetableIntegration = () => {
  const [integrationStatus, setIntegrationStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected');

  const reservationSystemStats = {
    totalSpaces: 42,
    availableSpaces: 38,
    occupancyRate: 85,
    activeReservations: 156
  };

  const timetableSystemStats = {
    generatedSchedules: 12,
    totalCourses: 1247,
    constraintsSatisfied: 98,
    optimizationScore: 92
  };

  const integrationFlow = [
    {
      step: 1,
      title: "Génération Emploi du Temps",
      description: "L'IA génère l'emploi du temps optimal selon les contraintes",
      icon: Calendar,
      status: "completed"
    },
    {
      step: 2,
      title: "Validation Automatique",
      description: "Vérification des conflits et contraintes",
      icon: CheckCircle2,
      status: "completed"
    },
    {
      step: 3,
      title: "Assignation des Ressources",
      description: "Attribution automatique des salles optimales",
      icon: MapPin,
      status: "completed"
    },
    {
      step: 4,
      title: "Création des Réservations",
      description: "Génération automatique des réservations semestrielles",
      icon: Building2,
      status: "active"
    },
    {
      step: 5,
      title: "Synchronisation",
      description: "Intégration avec le système de réservation",
      icon: Link,
      status: "pending"
    }
  ];

  const recentSyncEvents = [
    {
      id: 1,
      timestamp: "2024-06-16 10:30",
      action: "Réservations L1 S1 créées",
      details: "48 réservations créées pour le semestre",
      status: "success"
    },
    {
      id: 2,
      timestamp: "2024-06-16 09:15",
      action: "Validation emploi du temps M2",
      details: "Aucun conflit détecté",
      status: "success"
    },
    {
      id: 3,
      timestamp: "2024-06-16 08:45",
      action: "Mise à jour contraintes salles",
      details: "Nouvelles disponibilités intégrées",
      status: "info"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'active': return <Zap className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Intégration Emploi du Temps ↔ Réservations
          </CardTitle>
          <p className="text-slate-600">
            Synchronisation automatique entre la génération d'emplois du temps et le système de réservation
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getStatusColor(integrationStatus)}>
              {integrationStatus === 'connected' && 'Connecté'}
              {integrationStatus === 'disconnected' && 'Déconnecté'}
              {integrationStatus === 'syncing' && 'Synchronisation...'}
            </Badge>
            <Button variant="outline" size="sm">
              Tester la Connexion
            </Button>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Les systèmes sont parfaitement synchronisés. Les emplois du temps génèrent automatiquement 
              les réservations d'espaces pour l'ensemble du semestre.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="flow" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="flow">Flux d'Intégration</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="sync">Synchronisation</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processus d'Intégration Automatique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationFlow.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.step} className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${getStatusColor(item.status)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{item.title}</h4>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">
                          {item.status === 'completed' && 'Terminé'}
                          {item.status === 'active' && 'En cours'}
                          {item.status === 'pending' && 'En attente'}
                        </span>
                      </Badge>
                      {index < integrationFlow.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Système de Réservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Espaces totaux</span>
                    <span className="font-medium">{reservationSystemStats.totalSpaces}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Espaces disponibles</span>
                    <span className="font-medium text-green-600">{reservationSystemStats.availableSpaces}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Taux d'occupation</span>
                    <span className="font-medium text-blue-600">{reservationSystemStats.occupancyRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Réservations actives</span>
                    <span className="font-medium text-purple-600">{reservationSystemStats.activeReservations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Système Emploi du Temps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Emplois générés</span>
                    <span className="font-medium">{timetableSystemStats.generatedSchedules}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Cours programmés</span>
                    <span className="font-medium text-green-600">{timetableSystemStats.totalCourses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Contraintes respectées</span>
                    <span className="font-medium text-blue-600">{timetableSystemStats.constraintsSatisfied}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Score d'optimisation</span>
                    <span className="font-medium text-purple-600">{timetableSystemStats.optimizationScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Événements de Synchronisation Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSyncEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50">
                    <div className={`p-2 rounded ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{event.action}</p>
                      <p className="text-sm text-slate-600">{event.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'Intégration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Synchronisation Automatique</h4>
                    <p className="text-sm text-slate-600">Créer automatiquement les réservations lors de la génération</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activé</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Validation Automatique</h4>
                    <p className="text-sm text-slate-600">Valider automatiquement les réservations générées</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activé</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-slate-600">Alertes en cas de conflit ou d'erreur</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Activé</Badge>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sauvegarder Configuration
                  </Button>
                  <Button variant="outline">
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
