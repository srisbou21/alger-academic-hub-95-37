import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, Bell, CheckCircle, X } from "lucide-react";
import { EchelonAdvancement } from "../../../types/advancement";
import { advancementService } from "../../../services/advancementService";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  employeeId: string;
  employeeName: string;
  dueDate: Date;
  isRead: boolean;
  createdAt: Date;
}

export const AdvancementAlertsSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [advancements, setAdvancements] = useState<EchelonAdvancement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const advancementsData = await advancementService.getAllAdvancements();
      setAdvancements(advancementsData);
      generateAlerts(advancementsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'alertes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = (advancements: EchelonAdvancement[]) => {
    const generatedAlerts: Alert[] = [];
    const today = new Date();

    advancements.forEach(advancement => {
      const daysUntilEligible = Math.ceil((advancement.eligibilityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Alertes critiques - Éligibles mais non traités
      if (advancement.status === 'eligible') {
        generatedAlerts.push({
          id: `critical_${advancement.id}`,
          type: 'critical',
          title: 'Avancement éligible non traité',
          message: `L'employé ${advancement.employeeName} est éligible pour l'avancement depuis ${Math.abs(daysUntilEligible)} jours`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          dueDate: advancement.eligibilityDate,
          isRead: false,
          createdAt: new Date()
        });
      }

      // Alertes d'avertissement - Échéance proche (30 jours)
      if (daysUntilEligible > 0 && daysUntilEligible <= 30 && advancement.status === 'pending') {
        generatedAlerts.push({
          id: `warning_${advancement.id}`,
          type: 'warning',
          title: 'Échéance d\'avancement proche',
          message: `L'employé ${advancement.employeeName} sera éligible dans ${daysUntilEligible} jours`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          dueDate: advancement.eligibilityDate,
          isRead: false,
          createdAt: new Date()
        });
      }

      // Alertes d'information - Échéance dans 90 jours
      if (daysUntilEligible > 30 && daysUntilEligible <= 90 && advancement.status === 'pending') {
        generatedAlerts.push({
          id: `info_${advancement.id}`,
          type: 'info',
          title: 'Avancement prévu',
          message: `L'employé ${advancement.employeeName} sera éligible dans ${daysUntilEligible} jours`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          dueDate: advancement.eligibilityDate,
          isRead: false,
          createdAt: new Date()
        });
      }

      // Alertes pour suspensions
      if (advancement.status === 'suspended') {
        generatedAlerts.push({
          id: `suspended_${advancement.id}`,
          type: 'critical',
          title: 'Avancement suspendu',
          message: `L'avancement de ${advancement.employeeName} est suspendu: ${advancement.suspensionReason || 'Raison non spécifiée'}`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          dueDate: advancement.eligibilityDate,
          isRead: false,
          createdAt: new Date()
        });
      }
    });

    setAlerts(generatedAlerts);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertBadgeColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
    }
  };

  const criticalAlerts = alerts.filter(a => a.type === 'critical');
  const warningAlerts = alerts.filter(a => a.type === 'warning');
  const infoAlerts = alerts.filter(a => a.type === 'info');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Système d'Alertes Avancées
          </CardTitle>
          <p className="text-slate-600">
            Surveillance en temps réel des avancements et situations critiques
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border-red-200">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-medium text-red-700">Alertes Critiques</h4>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
                <p className="text-sm text-red-600">Nécessitent une action immédiate</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium text-yellow-700">Avertissements</h4>
                <p className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</p>
                <p className="text-sm text-yellow-600">Échéances dans 30 jours</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-blue-700">Informations</h4>
                <p className="text-2xl font-bold text-blue-600">{infoAlerts.length}</p>
                <p className="text-sm text-blue-600">Échéances dans 90 jours</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="critical" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="critical" className="text-red-600">
                Critiques ({criticalAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="warning" className="text-yellow-600">
                Avertissements ({warningAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="info" className="text-blue-600">
                Informations ({infoAlerts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="critical" className="space-y-4">
              {criticalAlerts.map(alert => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h4 className="font-semibold text-red-700">{alert.title}</h4>
                          <p className="text-slate-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getAlertBadgeColor(alert.type)}>
                              {alert.type === 'critical' ? 'Critique' : 
                               alert.type === 'warning' ? 'Avertissement' : 'Information'}
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {alert.dueDate.toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(alert.id)}
                          disabled={alert.isRead}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="warning" className="space-y-4">
              {warningAlerts.map(alert => (
                <Card key={alert.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h4 className="font-semibold text-yellow-700">{alert.title}</h4>
                          <p className="text-slate-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getAlertBadgeColor(alert.type)}>
                              Avertissement
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {alert.dueDate.toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(alert.id)}
                          disabled={alert.isRead}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              {infoAlerts.map(alert => (
                <Card key={alert.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h4 className="font-semibold text-blue-700">{alert.title}</h4>
                          <p className="text-slate-600 mt-1">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getAlertBadgeColor(alert.type)}>
                              Information
                            </Badge>
                            <span className="text-sm text-slate-500">
                              {alert.dueDate.toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(alert.id)}
                          disabled={alert.isRead}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
