
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { EchelonAdvancement } from "../../../types/advancement";

interface AdvancementAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
  action?: string;
  timestamp: Date;
}

interface AdvancementAlertsProps {
  advancements: EchelonAdvancement[];
}

export const AdvancementAlerts: React.FC<AdvancementAlertsProps> = ({ advancements }) => {
  const [alerts, setAlerts] = useState<AdvancementAlert[]>([]);

  useEffect(() => {
    generateAlerts();
  }, [advancements]);

  const generateAlerts = () => {
    const newAlerts: AdvancementAlert[] = [];

    advancements.forEach(advancement => {
      // Alerte pour les employés éligibles
      if (advancement.status === 'eligible') {
        newAlerts.push({
          id: `eligible_${advancement.id}`,
          type: 'success',
          title: 'Employé éligible',
          message: `${advancement.employeeName} est éligible pour l'avancement à l'échelon ${advancement.targetEchelon}`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          action: 'Générer proposition',
          timestamp: new Date()
        });
      }

      // Alerte pour les employés suspendus
      if (advancement.status === 'suspended') {
        newAlerts.push({
          id: `suspended_${advancement.id}`,
          type: 'error',
          title: 'Avancement suspendu',
          message: `L'avancement de ${advancement.employeeName} est suspendu (score: ${advancement.lastEvaluation.score}/20)`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          action: 'Réviser évaluation',
          timestamp: new Date()
        });
      }

      // Alerte pour les employés proches de l'éligibilité
      const progressPercentage = (advancement.anciennete.totalDays / (advancement.requiredDuration * 30)) * 100;
      if (progressPercentage >= 90 && advancement.status === 'pending') {
        newAlerts.push({
          id: `upcoming_${advancement.id}`,
          type: 'warning',
          title: 'Éligibilité prochaine',
          message: `${advancement.employeeName} sera éligible dans ${Math.ceil((advancement.requiredDuration * 30 - advancement.anciennete.totalDays))} jours`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          action: 'Préparer dossier',
          timestamp: new Date()
        });
      }

      // Alerte pour les employés sans évaluation récente
      const currentYear = new Date().getFullYear();
      if (advancement.lastEvaluation.year < currentYear - 1) {
        newAlerts.push({
          id: `no_eval_${advancement.id}`,
          type: 'warning',
          title: 'Évaluation manquante',
          message: `${advancement.employeeName} n'a pas d'évaluation récente (dernière: ${advancement.lastEvaluation.year})`,
          employeeId: advancement.employeeId,
          employeeName: advancement.employeeName,
          action: 'Programmer évaluation',
          timestamp: new Date()
        });
      }
    });

    setAlerts(newAlerts);
  };

  const getAlertIcon = (type: AdvancementAlert['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertVariant = (type: AdvancementAlert['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const groupedAlerts = alerts.reduce((groups, alert) => {
    if (!groups[alert.type]) {
      groups[alert.type] = [];
    }
    groups[alert.type].push(alert);
    return groups;
  }, {} as Record<string, AdvancementAlert[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertes et Notifications
          <Badge variant="secondary">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-slate-600">Aucune alerte active</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedAlerts).map(([type, typeAlerts]) => (
              <div key={type} className="space-y-2">
                <h4 className="font-medium text-sm text-slate-700 capitalize">
                  {type === 'success' ? 'Succès' :
                   type === 'warning' ? 'Avertissements' :
                   type === 'error' ? 'Erreurs' : 'Informations'}
                  <Badge variant="outline" className="ml-2">{typeAlerts.length}</Badge>
                </h4>
                {typeAlerts.map(alert => (
                  <Alert key={alert.id} variant={getAlertVariant(alert.type as any)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h5 className="font-medium text-sm">{alert.title}</h5>
                          <AlertDescription className="text-sm">
                            {alert.message}
                          </AlertDescription>
                          {alert.action && (
                            <Button variant="outline" size="sm" className="mt-2">
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        ×
                      </Button>
                    </div>
                  </Alert>
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
