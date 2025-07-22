
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Calendar, 
  Settings, 
  Bell, 
  BarChart3,
  Play,
  PlusCircle,
  CheckCircle
} from "lucide-react";
import { TimetableGenerator } from "./TimetableGenerator";
import { ConstraintManagement } from "./ConstraintManagement";
import { ScheduleGenerator } from "../planning/ScheduleGenerator";
import { OptimizationEngine } from "../planning/OptimizationEngine";
import { NotificationSystem } from "../planning/NotificationSystem";
import { AutomationDashboard } from "../AutomationDashboard";

export const TimetableModule = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="h-8 w-8 text-purple-600" />
            Module Emplois du Temps IA - Compacté
          </CardTitle>
          <p className="text-slate-600 text-lg">
            Système intelligent de génération automatique d'emplois du temps optimisé
          </p>
          <div className="flex gap-2 mt-4">
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Système Actif
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="h-3 w-3 mr-1" />
              IA Optimisée
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <Calendar className="h-3 w-3 mr-1" />
              Interface Compacte
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => setActiveTab("generator")}
            >
              <div className="flex flex-col items-center gap-2">
                <Zap className="h-6 w-6" />
                <span>Génération IA</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 border-blue-200 hover:bg-blue-50"
              onClick={() => setActiveTab("constraints")}
            >
              <div className="flex flex-col items-center gap-2">
                <Settings className="h-6 w-6" />
                <span>Contraintes</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 border-green-200 hover:bg-green-50"
              onClick={() => setActiveTab("optimization")}
            >
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Optimiser</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-white shadow-sm border border-slate-200">
          <TabsTrigger 
            value="dashboard"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Brain className="h-4 w-4 mr-2" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger 
            value="generator"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Générateur IA
          </TabsTrigger>
          <TabsTrigger 
            value="constraints"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Contraintes
          </TabsTrigger>
          <TabsTrigger 
            value="optimization"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Optimisation
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-800">Emplois du Temps Générés</h3>
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-900">127</p>
                <p className="text-sm text-blue-600">Cette semaine</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-green-800">Taux d'Optimisation</h3>
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-900">94.7%</p>
                <p className="text-sm text-green-600">Efficacité moyenne</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-purple-800">Conflits Résolus</h3>
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-900">45</p>
                <p className="text-sm text-purple-600">Automatiquement</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommandations IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Optimisation suggérée pour la formation L3 Informatique</p>
                    <p className="text-sm text-slate-600">Réduction possible de 15% des créneaux libres</p>
                  </div>
                  <Button size="sm">Appliquer</Button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Zap className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Nouvelle contrainte détectée</p>
                    <p className="text-sm text-slate-600">Préférence enseignant pour les créneaux matinaux</p>
                  </div>
                  <Button size="sm" variant="outline">Configurer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <TimetableGenerator />
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <ConstraintManagement />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationEngine />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
};
