import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  GraduationCap, 
  Settings, 
  Zap, 
  BookOpen, 
  CheckCircle,
  BarChart3,
  Clock,
  Users,
  Building,
  AlertTriangle,
  Trash2
} from "lucide-react";

import { FormationManager } from './formation/FormationManager';
import { TimetableGenerator } from './generator/TimetableGenerator';
import { OptimizationEngine } from './optimization/OptimizationEngine';
import { TimetableValidator } from './validation/TimetableValidator';
import { AutoReservationSystem } from './reservations/AutoReservationSystem';

export const TimetableManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("formations");
  const [systemStats, setSystemStats] = useState({
    totalFormations: 12,
    activeTimetables: 8,
    pendingReservations: 145,
    systemHealth: 95
  });

  const handleEmergencyCancel = () => {
    // Fonction d'annulation d'urgence de toutes les réservations
    console.log("Annulation d'urgence de toutes les réservations...");
  };

  return (
    <div className="space-y-6">
      {/* En-tête du système */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Calendar className="h-8 w-8 text-primary" />
                Système de Gestion d'Emplois du Temps
              </CardTitle>
              <p className="text-muted-foreground text-lg mt-2">
                Solution complète pour la gestion, l'optimisation et les réservations automatiques
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleEmergencyCancel}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Annulation d'urgence
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tableau de bord système */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg text-center border">
              <div className="text-2xl font-bold text-primary">{systemStats.totalFormations}</div>
              <p className="text-sm text-muted-foreground">Offres de formation</p>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border">
              <div className="text-2xl font-bold text-emerald-600">{systemStats.activeTimetables}</div>
              <p className="text-sm text-muted-foreground">Emplois du temps actifs</p>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border">
              <div className="text-2xl font-bold text-blue-600">{systemStats.pendingReservations}</div>
              <p className="text-sm text-muted-foreground">Réservations en cours</p>
            </div>
            <div className="bg-background p-4 rounded-lg text-center border">
              <div className="text-2xl font-bold text-purple-600">{systemStats.systemHealth}%</div>
              <p className="text-sm text-muted-foreground">Santé du système</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* État du système */}
      <Alert className="border-emerald-200 bg-emerald-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Système opérationnel</strong> - Tous les modules fonctionnent correctement. 
          Dernière synchronisation : il y a 2 minutes.
        </AlertDescription>
      </Alert>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="formations" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Formations
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Générateur
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimisation
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validation
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Réservations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analyses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="formations" className="space-y-4">
          <FormationManager />
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <TimetableGenerator />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <OptimizationEngine />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <TimetableValidator />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <AutoReservationSystem />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analyses et Rapports Avancés
              </CardTitle>
              <p className="text-muted-foreground">
                Statistiques détaillées et analyses de performance du système
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Métriques de performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Efficacité d'optimisation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">92%</div>
                    <p className="text-sm text-muted-foreground">
                      Amélioration moyenne par rapport aux emplois du temps manuels
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Conflits résolus</span>
                        <span className="font-medium">98%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Utilisation salles</span>
                        <span className="font-medium">87%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Réservations automatiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-emerald-600 mb-2">2,847</div>
                    <p className="text-sm text-muted-foreground">
                      Réservations créées automatiquement ce semestre
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taux de succès</span>
                        <span className="font-medium text-emerald-600">99.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conflits détectés</span>
                        <span className="font-medium text-orange-600">23</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Temps de traitement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">4.2s</div>
                    <p className="text-sm text-muted-foreground">
                      Temps moyen de génération d'un emploi du temps complet
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Optimisation IA</span>
                        <span className="font-medium">+1.8s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Validation auto</span>
                        <span className="font-medium">+0.4s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Utilisation par type de formation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition par niveau d'études</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-100 text-blue-800">Licence</Badge>
                        <span className="text-sm">6 formations actives</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-100 text-emerald-800">Master</Badge>
                        <span className="text-sm">4 formations actives</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-purple-100 text-purple-800">Doctorat</Badge>
                        <span className="text-sm">2 formations actives</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activités récentes du système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Emploi du temps Master Informatique généré</p>
                        <p className="text-xs text-muted-foreground">145 créneaux créés, 12 réservations automatiques</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">Il y a 3 min</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Optimisation terminée pour Licence Mathématiques</p>
                        <p className="text-xs text-muted-foreground">Score d'optimisation : 94/100</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">Il y a 8 min</Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Conflit détecté et résolu automatiquement</p>
                        <p className="text-xs text-muted-foreground">Salle 205 - Créneau Mardi 14h-16h repositionné</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">Il y a 15 min</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fonctionnalités système */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités Avancées du Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Optimisation IA</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Algorithmes d'intelligence artificielle pour l'optimisation automatique des emplois du temps
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h4 className="font-medium">Réservations Automatiques</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Création automatique de toutes les réservations pour la durée complète du semestre
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">Gestion Avancée</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Outils complets pour la saisie, validation et annulation des emplois du temps
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};