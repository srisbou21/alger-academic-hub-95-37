
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye } from "lucide-react";
import { WorkloadStatistics } from "../../../types/teacher";

interface WorkloadAlertsProps {
  alerts: WorkloadStatistics['alerts'];
}

export const WorkloadAlerts: React.FC<WorkloadAlertsProps> = ({ alerts }) => {
  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    const labels = {
      low: "Faible",
      medium: "Moyen",
      high: "Élevé"
    };
    
    return (
      <Badge className={variants[severity as keyof typeof variants]}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const getAlertTypeBadge = (type: string) => {
    const variants = {
      overload: "bg-red-100 text-red-800",
      underload: "bg-blue-100 text-blue-800",
      unbalanced: "bg-yellow-100 text-yellow-800"
    };
    const labels = {
      overload: "Surcharge",
      underload: "Sous-charge",
      unbalanced: "Déséquilibré"
    };
    
    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Alertes et Recommandations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getAlertTypeBadge(alert.type)}
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <h4 className="font-medium">{alert.teacherName}</h4>
                  <p className="text-sm text-slate-600">
                    Charge actuelle: {alert.currentHours}h / Recommandé: {alert.recommendedHours}h
                  </p>
                </div>
              </div>
              
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Détails
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
