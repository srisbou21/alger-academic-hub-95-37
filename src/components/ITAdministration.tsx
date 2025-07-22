
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Server, Shield, Users, Wrench, Network, HardDrive, Activity, AlertTriangle, CheckCircle, Clock, Database, Wifi } from "lucide-react";

export const ITAdministration = () => {
  const systemStatus = [
    { name: "Serveur principal", status: "operational", uptime: "99.8%", load: 65 },
    { name: "Base de données", status: "operational", uptime: "99.9%", load: 45 },
    { name: "Serveur de sauvegarde", status: "maintenance", uptime: "98.2%", load: 85 },
    { name: "Réseau universitaire", status: "operational", uptime: "99.5%", load: 32 }
  ];

  const backupSchedule = [
    { type: "Sauvegarde quotidienne", lastRun: "2024-06-14 02:00", status: "success", size: "2.4 GB" },
    { type: "Sauvegarde hebdomadaire", lastRun: "2024-06-13 23:00", status: "success", size: "12.8 GB" },
    { type: "Sauvegarde mensuelle", lastRun: "2024-06-01 01:00", status: "success", size: "45.2 GB" },
    { type: "Réplication temps réel", lastRun: "En cours", status: "running", size: "Continu" }
  ];

  const supportTickets = [
    { id: "IT-2024-156", user: "Ahmed Benali (Enseignant)", issue: "Problème connexion plateforme", priority: "high", status: "open" },
    { id: "IT-2024-157", user: "Sarah Meziani (Étudiante)", issue: "Mot de passe oublié", priority: "medium", status: "in-progress" },
    { id: "IT-2024-158", user: "Karim Ouali (Admin)", issue: "Accès base de données", priority: "high", status: "resolved" },
    { id: "IT-2024-159", user: "Nadia Benaissa (Enseignante)", issue: "Lenteur système", priority: "low", status: "open" }
  ];

  const integrationSystems = [
    { name: "Système PROGRES", status: "connected", lastSync: "2024-06-14 08:30", health: 95 },
    { name: "Plateforme LMD", status: "connected", lastSync: "2024-06-14 08:25", health: 88 },
    { name: "Système financier", status: "warning", lastSync: "2024-06-14 07:45", health: 72 },
    { name: "Messagerie universitaire", status: "connected", lastSync: "2024-06-14 08:35", health: 92 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": case "connected": case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": case "in-progress": case "running": return "bg-amber-100 text-amber-800 border-amber-200";
      case "maintenance": case "open": return "bg-blue-100 text-blue-800 border-blue-200";
      case "error": case "failed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": case "connected": case "success": case "resolved": return <CheckCircle className="h-4 w-4" />;
      case "warning": case "in-progress": case "running": return <Clock className="h-4 w-4" />;
      case "maintenance": case "open": return <Wrench className="h-4 w-4" />;
      case "error": case "failed": return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Administration Technique</h2>
          <p className="text-slate-600">Gestion du système informatique de la faculté</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Service Informatique
        </Badge>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="backup">Sauvegardes</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="integration">Intégration</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Systèmes opérationnels</p>
                    <p className="text-2xl font-bold text-green-800">3/4</p>
                  </div>
                  <Server className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Uptime moyen</p>
                    <p className="text-2xl font-bold text-blue-800">99.1%</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Charge moyenne</p>
                    <p className="text-2xl font-bold text-purple-800">56%</p>
                  </div>
                  <HardDrive className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-medium">Alertes actives</p>
                    <p className="text-2xl font-bold text-amber-800">2</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                État Détaillé des Systèmes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(system.status)}
                      <div>
                        <h4 className="font-medium text-slate-800">{system.name}</h4>
                        <p className="text-sm text-slate-500">Uptime: {system.uptime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Charge: {system.load}%</p>
                        <Progress value={system.load} className="w-24 h-2" />
                      </div>
                      <Badge className={getStatusColor(system.status)}>
                        {system.status === "operational" ? "Opérationnel" : 
                         system.status === "maintenance" ? "Maintenance" : "Erreur"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestion des Sauvegardes
              </CardTitle>
              <CardDescription>Planning et suivi des sauvegardes système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupSchedule.map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(backup.status)}
                      <div>
                        <h4 className="font-medium text-slate-800">{backup.type}</h4>
                        <p className="text-sm text-slate-500">Dernière exécution: {backup.lastRun}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-600">{backup.size}</span>
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status === "success" ? "Réussie" : 
                         backup.status === "running" ? "En cours" : "Échec"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Shield className="h-4 w-4 mr-2" />
                    Lancer sauvegarde manuelle
                  </Button>
                  <Button variant="outline">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Vérifier intégrité
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Support Utilisateurs - Niveau 2
              </CardTitle>
              <CardDescription>Gestion des tickets de support technique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-800">{ticket.id}</h4>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === "high" ? "Haute" : 
                           ticket.priority === "medium" ? "Moyenne" : "Basse"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{ticket.user}</p>
                      <p className="text-sm text-slate-500">{ticket.issue}</p>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status === "open" ? "Ouvert" : 
                       ticket.status === "in-progress" ? "En cours" : "Résolu"}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Users className="h-4 w-4 mr-2" />
                    Nouveau ticket
                  </Button>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Rapport support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Préventive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Maintenance serveur programmée: Dimanche 16/06 à 02:00
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Mise à jour sécurité</span>
                      <Badge className="bg-green-100 text-green-800">Planifié</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">Nettoyage disques</span>
                      <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-sm">Optimisation base</span>
                      <Badge className="bg-slate-100 text-slate-800">Programmé</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Interventions Correctives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm">Panne réseau Bât. A</span>
                      <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                      <span className="text-sm">Lenteur serveur web</span>
                      <Badge className="bg-amber-100 text-amber-800">En cours</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm">Problème imprimante</span>
                      <Badge className="bg-green-100 text-green-800">Résolu</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Intégration Systèmes Universitaires
              </CardTitle>
              <CardDescription>Monitoring des connexions avec les systèmes externes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrationSystems.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Network className="h-5 w-5 text-slate-600" />
                      <div>
                        <h4 className="font-medium text-slate-800">{system.name}</h4>
                        <p className="text-sm text-slate-500">Dernière sync: {system.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Santé: {system.health}%</p>
                        <Progress value={system.health} className="w-24 h-2" />
                      </div>
                      <Badge className={getStatusColor(system.status)}>
                        {system.status === "connected" ? "Connecté" : 
                         system.status === "warning" ? "Attention" : "Déconnecté"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Wifi className="h-4 w-4 mr-2" />
                    Tester connexions
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Synchroniser données
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
