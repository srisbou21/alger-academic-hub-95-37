import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, 
  Zap, 
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Activity
} from "lucide-react";
import { useAutomation } from "@/hooks/useAutomation";
import { useToast } from "@/hooks/use-toast";

export const AutomationDashboard = () => {
  const { 
    autoGenerateAll, 
    autoSync,
    isProcessing
  } = useAutomation();
  const { toast } = useToast();
  
  const [automationSettings, setAutomationSettings] = useState({
    autoValidation: true,
    autoNotifications: true,
    autoScheduling: false,
    autoGrading: false,
    autoReporting: true,
    autoBackup: true
  });

  const [processStatus, setProcessStatus] = useState({
    timetableGeneration: 'idle',
    studentAssignment: 'idle',
    requestValidation: 'idle',
    moduleSync: 'idle'
  });

  const automationTasks = [
    {
      id: 'auto_validation',
      title: 'Validation Automatique des Demandes',
      description: 'Traitement automatique des demandes simples selon les règles prédéfinies',
      status: 'active',
      processed: 247,
      success: 89,
      icon: Shield,
      color: 'text-green-600'
    },
    {
      id: 'auto_scheduling',
      title: 'Génération Emplois du Temps',
      description: 'Création automatique des plannings avec gestion des conflits',
      status: 'active',
      processed: 12,
      success: 75,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 'auto_notifications',
      title: 'Notifications Intelligentes',
      description: 'Envoi automatique de notifications contextuelles',
      status: 'active',
      processed: 1542,
      success: 97,
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      id: 'auto_reporting',
      title: 'Génération de Rapports',
      description: 'Création automatique de rapports statistiques périodiques',
      status: 'scheduled',
      processed: 28,
      success: 92,
      icon: FileText,
      color: 'text-amber-600'
    },
    {
      id: 'auto_assignment',
      title: 'Attribution Groupes',
      description: 'Répartition automatique des étudiants dans les groupes',
      status: 'paused',
      processed: 156,
      success: 85,
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const systemMetrics = {
    totalAutomatedTasks: 1985,
    successRate: 91.3,
    timeSaved: '247h',
    errorsReduced: 73,
    userSatisfaction: 87.5
  };

  const upcomingTasks = [
    { task: 'Génération emplois du temps S2', time: '2h 30m', priority: 'high' },
    { task: 'Validation bourses enseignants', time: '4h 15m', priority: 'medium' },
    { task: 'Synchronisation modules', time: '6h 00m', priority: 'low' },
    { task: 'Backup automatique', time: '12h 00m', priority: 'medium' }
  ];

  const handleAutomationToggle = (key: string, value: boolean) => {
    setAutomationSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Configuration mise à jour",
      description: `${key} ${value ? 'activé' : 'désactivé'}`,
    });
  };

  const handleRunAutomation = async (taskType: string) => {
    setProcessStatus(prev => ({
      ...prev,
      [taskType]: 'running'
    }));

    try {
      let result;
      switch (taskType) {
        case 'timetableGeneration':
          result = await autoGenerateAll({
            id: 'formation-1',
            level: 'L3',
            sections: []
          } as any, 'S1');
          break;
        case 'moduleSync':
          result = await autoSync();
          break;
        default:
          result = { success: true };
      }

      setProcessStatus(prev => ({
        ...prev,
        [taskType]: 'completed'
      }));

      toast({
        title: "Automatisation réussie",
        description: "Le processus a été exécuté avec succès",
      });
    } catch (error) {
      setProcessStatus(prev => ({
        ...prev,
        [taskType]: 'error'
      }));

      toast({
        title: "Erreur d'automatisation",
        description: "Une erreur s'est produite lors de l'exécution",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'paused': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      paused: "bg-orange-100 text-orange-800",
      error: "bg-red-100 text-red-800"
    };
    
    const labels = {
      active: "Actif",
      scheduled: "Planifié",
      paused: "En pause",
      error: "Erreur"
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Centre d'Automatisation Intelligent
          </CardTitle>
          <p className="text-slate-600">
            Gestion centralisée de tous les processus automatisés de la faculté
          </p>
        </CardHeader>
      </Card>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Tâches Automatisées</p>
                <p className="text-2xl font-bold text-blue-800">{systemMetrics.totalAutomatedTasks}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Taux de Réussite</p>
                <p className="text-2xl font-bold text-green-800">{systemMetrics.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Temps Économisé</p>
                <p className="text-2xl font-bold text-purple-800">{systemMetrics.timeSaved}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">Erreurs Réduites</p>
                <p className="text-2xl font-bold text-amber-800">{systemMetrics.errorsReduced}%</p>
              </div>
              <Shield className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Satisfaction</p>
                <p className="text-2xl font-bold text-emerald-800">{systemMetrics.userSatisfaction}%</p>
              </div>
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tasks">Tâches Actives</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
          <TabsTrigger value="scheduler">Planificateur</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tâches d'automatisation */}
            <Card>
              <CardHeader>
                <CardTitle>Processus Automatisés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {automationTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <task.icon className={`h-5 w-5 ${task.color}`} />
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-slate-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(task.status)}
                      <p className="text-xs text-slate-500 mt-1">
                        {task.processed} traités | {task.success}% succès
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tâches à venir */}
            <Card>
              <CardHeader>
                <CardTitle>Tâches Programmées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{task.task}</h4>
                      <p className="text-sm text-slate-500">Dans {task.time}</p>
                    </div>
                    <Badge className={
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {task.priority === 'high' ? 'Priorité Haute' :
                       task.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => handleRunAutomation('timetableGeneration')}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={processStatus.timetableGeneration === 'running'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Générer Emplois du Temps
                </Button>
                <Button 
                  onClick={() => handleRunAutomation('moduleSync')}
                  variant="outline"
                  disabled={processStatus.moduleSync === 'running'}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Synchroniser Modules
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Générer Rapports
                </Button>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Validation Batch
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Surveillance des Tâches en Temps Réel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(processStatus).map(([task, status]) => (
                <div key={task} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">{task.replace(/([A-Z])/g, ' $1')}</h4>
                    <p className="text-sm text-slate-500">
                      {status === 'running' ? 'En cours d\'exécution...' :
                       status === 'completed' ? 'Terminé avec succès' :
                       status === 'error' ? 'Erreur détectée' : 'En attente'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {status === 'running' && <Progress value={45} className="w-24" />}
                    {getStatusIcon(status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'Automatisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(automationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      {key === 'autoValidation' && 'Validation Automatique'}
                      {key === 'autoNotifications' && 'Notifications Automatiques'}
                      {key === 'autoScheduling' && 'Planification Automatique'}
                      {key === 'autoGrading' && 'Notation Automatique'}
                      {key === 'autoReporting' && 'Rapports Automatiques'}
                      {key === 'autoBackup' && 'Sauvegarde Automatique'}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {key === 'autoValidation' && 'Traitement automatique des demandes simples'}
                      {key === 'autoNotifications' && 'Envoi intelligent de notifications'}
                      {key === 'autoScheduling' && 'Génération automatique des emplois du temps'}
                      {key === 'autoGrading' && 'Calcul automatique des moyennes'}
                      {key === 'autoReporting' && 'Génération périodique de rapports'}
                      {key === 'autoBackup' && 'Sauvegarde quotidienne des données'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleAutomationToggle(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planificateur de Tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Interface de planification avancée</p>
                <p className="text-sm text-slate-400 mt-2">
                  Configurez les horaires d'exécution automatique
                </p>
                <Button className="mt-4">
                  Configurer Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};